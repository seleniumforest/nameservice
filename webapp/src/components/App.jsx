import { Box } from "@mui/material";
import MetamaskConnector from "./MetamaskConnector";
import NameChecker from "./NameChecker";

function App() {
    return (
        <>
            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
                <Box gridColumn="span 3">
                </Box>
                <Box gridColumn="span 6" 
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    margin="200px 0 0 0">
                    {/* <MetamaskConnector />
                    <br /> */}
                    <NameChecker />
                </Box>
                <Box gridColumn="span 3">
                </Box>
            </Box>
        </>
    );
}

export default App;
