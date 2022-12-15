import { ReactComponent as TypingLoader } from '../assets/typing.svg';
import { Flex, Text } from '@chakra-ui/react';

export const TypingIndicator = () => (
    <Flex>
        <Text color={'green.300'}>Is typing</Text>
        <TypingLoader />
    </Flex>
)