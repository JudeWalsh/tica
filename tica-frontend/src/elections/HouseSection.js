import React, { useState, useEffect } from "react";
import { Box, Typography } from '@mui/material';
import { TicaHouseGrid} from "./Representatives";
import CongressionalGauge from './CongressionalGauge';
import HouseAnalytics from "./HouseAnalytics";

const HouseSection = ({ selectedYear }) => {
    const [houseData, setHouseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!selectedYear) return;

        const fetchElectionData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8000/house_analytics/${selectedYear}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setHouseData(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchElectionData();
    }, [selectedYear]);

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography>Error: {error}</Typography>;
    }

    // Render component only after data is loaded
    return (
        <Box sx={{
            flex: 1,
            textAlign: "center",
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '50%',
        }}>
            {/* Top 50% of the height for TicaSenatorGrid */}
            <Box sx={{
                flex: '1 1 50%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}>
                <Typography>
                    House
                </Typography>
                <TicaHouseGrid
                    redReps={houseData.republicans}
                    blueReps={houseData.democrats}
                    purpleReps={houseData.independents}
                />
            </Box>

            {/* Bottom 50% of the height for CongressionalGauge */}
            <Box sx={{
                flex: '1 1 50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <CongressionalGauge
                    senate={false}
                    blueDiplomats={houseData.democrats}
                />
            </Box>

            {/* House Analytics */}
            <Box sx={{
                flex: '1 1 50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <HouseAnalytics analytics={houseData.analytics} republicans={houseData.republicans} democrats={houseData.democrats} />
            </Box>
        </Box>
    );
};

export default HouseSection;
