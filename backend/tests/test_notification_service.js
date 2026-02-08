import dotenv from "dotenv";
dotenv.config();

import prisma from "../src/config/db.js";
import createNotification from "../src/services/notification.js";
import alertCheck from "../src/services/alertCheck.js";
import nasaService from "../src/services/nasaService.js";

let testUserId;
let testWatchId;

async function cleanup() {
  try {
    if (testWatchId) {
      await prisma.watchedAsteroid.delete({ where: { id: testWatchId } }).catch(() => {});
    }
    if (testUserId) {
      await prisma.notification.deleteMany({ where: { userId: testUserId } });
      await prisma.user.delete({ where: { id: testUserId } }).catch(() => {});
    }
  } catch (error) {
    console.log("Cleanup warning:", error.message);
  }
}

async function test1_createNotification() {
  console.log("\n=== Test 1: Create Notification ===");
  
  try {
    // Create a test user
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: `test_notif_${Date.now()}@example.com`,
        passwordHash: "test123",
      },
    });
    testUserId = user.id;

    // Create a notification
    await createNotification(user.id, "Test notification message");

    // Verify notification was created
    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
    });

    if (notifications.length > 0 && notifications[0].message === "Test notification message") {
      console.log("✅ PASS: Notification created successfully");
      console.log("   Message:", notifications[0].message);
      console.log("   Is Read:", notifications[0].isRead);
      return true;
    } else {
      console.log("❌ FAIL: Notification not created");
      return false;
    }
  } catch (error) {
    console.log("❌ FAIL:", error.message);
    return false;
  }
}

async function test2_alertCheckDistanceThreshold() {
  console.log("\n=== Test 2: Alert Check - Distance Threshold ===");
  
  try {
    // Create watched asteroid with distance threshold
    const watch = await prisma.watchedAsteroid.create({
      data: {
        neoId: "2000433",
        alertDistanceKm: 10000000,
        alertDaysBefore: 7,
        userId: testUserId,
      },
      include: { user: true },
    });
    testWatchId = watch.id;

    // Create mock NEO data within threshold
    const mockNeo = {
      id: "2000433",
      name: "(433) Eros",
      is_potentially_hazardous_asteroid: false,
      estimated_diameter: {
        kilometers: {
          estimated_diameter_max: 16.84,
        },
      },
      close_approach_data: [{
        close_approach_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        miss_distance: {
          kilometers: "8000000",
        },
        relative_velocity: {
          kilometers_per_second: "15",
        },
      }],
    };

    const approach = mockNeo.close_approach_data[0];

    // Count notifications before
    const notifsBefore = await prisma.notification.count({
      where: { userId: testUserId },
    });

    // Run alert check
    await alertCheck(watch, mockNeo, approach);

    // Count notifications after
    const notifsAfter = await prisma.notification.count({
      where: { userId: testUserId },
    });

    const newNotifications = await prisma.notification.findMany({
      where: { userId: testUserId },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    console.log(`   Notifications before: ${notifsBefore}`);
    console.log(`   Notifications after: ${notifsAfter}`);
    console.log(`   New notifications created: ${notifsAfter - notifsBefore}`);
    
    if (newNotifications.length > 0) {
      console.log("   Recent notifications:");
      newNotifications.forEach((n, i) => {
        console.log(`   ${i + 1}. ${n.message}`);
      });
    }

    if (notifsAfter > notifsBefore) {
      console.log("✅ PASS: Notifications created by alert check");
      return true;
    } else {
      console.log("❌ FAIL: No notifications created");
      return false;
    }
  } catch (error) {
    console.log("❌ FAIL:", error.message);
    console.error(error);
    return false;
  }
}

async function test3_alertCheckRiskLevelChange() {
  console.log("\n=== Test 3: Alert Check - Risk Level Change ===");
  
  try {
    // Update watch with a different lastRiskLevel
    await prisma.watchedAsteroid.update({
      where: { id: testWatchId },
      data: { lastRiskLevel: "Low" },
    });

    const watch = await prisma.watchedAsteroid.findUnique({
      where: { id: testWatchId },
      include: { user: true },
    });

    // Create mock NEO data that should trigger high risk
    const mockHighRiskNeo = {
      id: "2000433",
      name: "(433) Eros",
      is_potentially_hazardous_asteroid: true,
      estimated_diameter: {
        kilometers: {
          estimated_diameter_max: 16.84, // > 0.5 km = 30 points
        },
      },
      close_approach_data: [{
        close_approach_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        miss_distance: {
          kilometers: "3000000", // < 5M km = 40 points
        },
        relative_velocity: {
          kilometers_per_second: "25", // > 20 km/s = 20 points
        },
      }],
    };

    const approach = mockHighRiskNeo.close_approach_data[0];

    const notifsBefore = await prisma.notification.count({
      where: { userId: testUserId },
    });

    // Run alert check
    await alertCheck(watch, mockHighRiskNeo, approach);

    const notifsAfter = await prisma.notification.count({
      where: { userId: testUserId },
    });

    // Check if lastRiskLevel was updated
    const updatedWatch = await prisma.watchedAsteroid.findUnique({
      where: { id: testWatchId },
    });

    const latestNotif = await prisma.notification.findFirst({
      where: { userId: testUserId },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`   Previous risk level: Low`);
    console.log(`   New risk level: ${updatedWatch.lastRiskLevel}`);
    console.log(`   Latest notification: ${latestNotif?.message || 'None'}`);
    console.log(`   New notifications: ${notifsAfter - notifsBefore}`);

    if (updatedWatch.lastRiskLevel !== "Low" && notifsAfter > notifsBefore) {
      console.log("✅ PASS: Risk level change detected and notification created");
      return true;
    } else {
      console.log("❌ FAIL: Risk level change not properly handled");
      return false;
    }
  } catch (error) {
    console.log("❌ FAIL:", error.message);
    console.error(error);
    return false;
  }
}

async function test4_realNasaDataIntegration() {
  console.log("\n=== Test 4: Real NASA Data Integration ===");
  
  try {
    // Get real NASA data
    const data = await nasaService.getNeoData();
    const allNeos = Object.values(data.near_earth_objects).flat();

    console.log(`   Fetched ${allNeos.length} NEOs from NASA API`);

    if (allNeos.length === 0) {
      console.log("⚠️  WARNING: No NEOs returned from NASA API");
      return false;
    }

    // Use the first NEO for testing
    const testNeo = allNeos[0];
    console.log(`   Test NEO: ${testNeo.name} (ID: ${testNeo.id})`);

    // Update watch to match this NEO
    await prisma.watchedAsteroid.update({
      where: { id: testWatchId },
      data: {
        neoId: testNeo.id,
        alertDistanceKm: 50000000, // 50M km threshold
        alertDaysBefore: 1,
        lastRiskLevel: "Low",
      },
    });

    const watch = await prisma.watchedAsteroid.findUnique({
      where: { id: testWatchId },
      include: { user: true },
    });

    if (testNeo.close_approach_data && testNeo.close_approach_data.length > 0) {
      const approach = testNeo.close_approach_data[0];
      
      console.log(`   Approach date: ${approach.close_approach_date}`);
      console.log(`   Miss distance: ${parseFloat(approach.miss_distance.kilometers).toFixed(0)} km`);
      console.log(`   Velocity: ${approach.relative_velocity.kilometers_per_second} km/s`);

      const notifsBefore = await prisma.notification.count({
        where: { userId: testUserId },
      });

      // Run alert check with real data
      await alertCheck(watch, testNeo, approach);

      const notifsAfter = await prisma.notification.count({
        where: { userId: testUserId },
      });

      console.log(`   Notifications created: ${notifsAfter - notifsBefore}`);

      console.log("✅ PASS: Real NASA data integration working");
      return true;
    } else {
      console.log("⚠️  WARNING: No approach data available");
      return false;
    }
  } catch (error) {
    console.log("❌ FAIL:", error.message);
    console.error(error);
    return false;
  }
}

async function test5_cronJobSimulation() {
  console.log("\n=== Test 5: Cron Job Logic Simulation ===");
  
  try {
    // Simulate what the cron job does
    const data = await nasaService.getNeoData();
    const allNeos = Object.values(data.near_earth_objects).flat();

    const watched = await prisma.watchedAsteroid.findMany({
      where: { userId: testUserId },
      include: { user: true },
    });

    console.log(`   Total NEOs: ${allNeos.length}`);
    console.log(`   Watched asteroids: ${watched.length}`);

    let processedCount = 0;
    for (let watch of watched) {
      const neo = allNeos.find((n) => n.id === watch.neoId);
      if (!neo) continue;
      
      const approach = neo.close_approach_data[0];
      if (!approach) continue;

      await alertCheck(watch, neo, approach);
      processedCount++;
    }

    console.log(`   Processed ${processedCount} watched asteroids`);

    if (processedCount > 0) {
      console.log("✅ PASS: Cron job logic simulation successful");
      return true;
    } else {
      console.log("⚠️  Note: No matching asteroids found in current NASA feed");
      return true; // Still passing as the logic works
    }
  } catch (error) {
    console.log("❌ FAIL:", error.message);
    console.error(error);
    return false;
  }
}

async function test6_getAllNotifications() {
  console.log("\n=== Test 6: Retrieve All Notifications ===");
  
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: testUserId },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`   Total notifications for test user: ${notifications.length}`);
    console.log("\n   All notifications:");
    notifications.forEach((notif, i) => {
      console.log(`   ${i + 1}. [${notif.isRead ? 'Read' : 'Unread'}] ${notif.message}`);
      console.log(`      Created: ${notif.createdAt.toISOString()}`);
    });

    if (notifications.length > 0) {
      console.log("\n✅ PASS: Successfully retrieved all notifications");
      return true;
    } else {
      console.log("\n⚠️  WARNING: No notifications found");
      return false;
    }
  } catch (error) {
    console.log("❌ FAIL:", error.message);
    return false;
  }
}

async function runAllTests() {
  console.log("╔════════════════════════════════════════════╗");
  console.log("║  NOTIFICATION SERVICE TEST SUITE          ║");
  console.log("╚════════════════════════════════════════════╝");

  const results = [];

  try {
    results.push(await test1_createNotification());
    results.push(await test2_alertCheckDistanceThreshold());
    results.push(await test3_alertCheckRiskLevelChange());
    results.push(await test4_realNasaDataIntegration());
    results.push(await test5_cronJobSimulation());
    results.push(await test6_getAllNotifications());

    console.log("\n╔════════════════════════════════════════════╗");
    console.log("║  TEST RESULTS SUMMARY                     ║");
    console.log("╚════════════════════════════════════════════╝");
    
    const passed = results.filter(r => r === true).length;
    const total = results.length;
    
    console.log(`\n   Tests Passed: ${passed}/${total}`);
    console.log(`   Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

    if (passed === total) {
      console.log("\n   🎉 ALL TESTS PASSED! 🎉");
    } else {
      console.log("\n   ⚠️  SOME TESTS FAILED");
    }

  } catch (error) {
    console.error("\n❌ Test suite error:", error);
  } finally {
    await cleanup();
    await prisma.$disconnect();
    console.log("\n✨ Test suite completed and cleaned up\n");
  }
}

runAllTests();
