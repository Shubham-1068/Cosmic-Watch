export interface Asteroid {
    id: string
    name: string
    estimatedDiameter: {
        kilometers: {
            estimated_diameter_min: number
            estimated_diameter_max: number
        }
    }
    close_approach_data: Array<{
        close_approach_date: string
        miss_distance: {
            kilometers: string
            miles?: string
            lunar_distance?: string
        }
        relative_velocity: {
            kilometers_per_second: string
            kilometers_per_hour?: string
            miles_per_hour?: string
        }
    }>
    is_potentially_hazardous_asteroid: boolean
    nasa_jpl_url?: string
    diameter?: number // Virtual field for processed data
    velocity?: number // Virtual field for processed data
    distance?: number // Virtual field for processed data
    hazardLevel?: 'low' | 'medium' | 'high' // Virtual field for processed data
}
