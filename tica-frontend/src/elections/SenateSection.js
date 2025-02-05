import React, { useState, useEffect } from "react";
import { Box, Typography } from '@mui/material';
import { TicaSenatorGrid } from "./Senators";
import CongressionalGauge from './CongressionalGauge';
import SenateAnalytics from "./SenateAnalytics";

const SenateSection = ({ selectedYear }) => {
    const [senateData, setSenateData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!selectedYear) return;

        const fetchElectionData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://127.0.0.1:8000/senate_analytics/${selectedYear}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setSenateData(data);
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
                    Senate
                </Typography>
                <TicaSenatorGrid
                    redSenators={senateData.republicans}
                    blueSenators={senateData.democrats}
                    purpleSenators={senateData.independents}
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
                    senate={true}
                    blueDiplomats={senateData.democrats}
                />
            </Box>

            {/* Senate Analytics */}
            <Box sx={{
                flex: '1 1 50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <SenateAnalytics analytics={senateData.analytics} republicans={senateData.republicans} democrats={senateData.democrats} />
            </Box>
        </Box>
    );
};

export default SenateSection;
