import axios from "axios";
import dns from "dns";
import https from "https";

const key = process.env.NASA_API_KEY;

const httpsAgent = new https.Agent({
    keepAlive: true,
    // Prefer IPv4 to avoid IPv6/dual-stack timeouts in some container networks.
    lookup: (hostname, options, callback) =>
        dns.lookup(hostname, { ...options, family: 4 }, callback),
});

async function getNeoData() {
    const url = "https://api.nasa.gov/neo/rest/v1/feed?api_key=" + key;
    const res = await axios.get(url, { httpsAgent, timeout: 15000 });
    return res.data;
}

export default {getNeoData};