import { Container, Box, Center, Heading } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { VStack } from '@chakra-ui/react'
import { EnterAppForm } from '../cmps/homepage/EnterAppForm'

export const Homepage = () => {

    return (
        <Container width='100%' height='100vh' p='2'>
            <VStack spacing='1rem'>
                <Center background='white' borderRadius='lg' p='3' width='100%'>
                    <Heading>Hush</Heading>
                </Center>

                <Box background='white' borderRadius='lg' p='4' width='100%'>
                    <Tabs isFitted variant='enclosed-colored' colorScheme='whatsapp'>
                        <TabList mb='0em'>
                            <Tab>Login</Tab>
                            <Tab>Sign Up</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <EnterAppForm isSignup={false} />
                            </TabPanel>
                            <TabPanel>
                                <EnterAppForm isSignup={true} />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </VStack>
        </Container >
    )
}

