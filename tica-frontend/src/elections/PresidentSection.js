import React, { useState, useEffect } from "react";
import { Box, Typography } from '@mui/material';
import CongressionalGauge from './CongressionalGauge';
import SenateAnalytics from "./SenateAnalytics";
import ElectoralCollege from "./ElectoralCollege";
import PresidentAnalytics from "./PresidentAnalytics";
import StateAnalytics from "./StateAnalytics";

const PresidentSection = ({ selectedYear }) => {
    const [selectedState, setSelectedState] = useState(null)
    const [presidentData, setPresidentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!selectedYear) return;

        const fetchElectionData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://127.0.0.1:8000/president_analytics/${selectedYear}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setPresidentData(data);
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
                    President
                </Typography>
                <ElectoralCollege
                    redStates={presidentData.red_states}
                    blueStates={presidentData.blue_states}
                    yellowStates={presidentData.yellow_states}
                    setState={setSelectedState}
                />
            </Box>

            {/* Bottom 50% of the height for CongressionalGauge */}
            <Box sx={{
                flex: '1 1 50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <PresidentAnalytics analytics={presidentData.analytics}/>
            </Box>

            {/* State Analytics */}
            <Box sx={{
                flex: '1 1 50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <StateAnalytics stateID={selectedState} selectedYear={selectedYear}/>
            </Box>
        </Box>
    );
};

export default PresidentSection;
