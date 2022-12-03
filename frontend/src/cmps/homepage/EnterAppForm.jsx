import { ImUpload } from 'react-icons/im'
import { VStack, Image, Center } from '@chakra-ui/react'
import { Button, Tooltip, Icon } from '@chakra-ui/react'
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    InputGroup,
    InputRightElement
} from '@chakra-ui/react'
import { useState } from 'react';
import { cloudService } from '../../services/cloudinary-service';
import { userService } from '../../services/user.service'
import { useFormik } from 'formik';
import * as Yup from 'yup';



export const EnterAppForm = ({ isSignup }) => {
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)

    const formik = useFormik({
        initialValues: userService.createEmptyUser(),
        onSubmit: values => onSubmit(values),
        validationSchema: Yup.object({
            alias: isSignup && Yup.string()
                .max(15, 'Must be 15 characters or less')
                .required('Required'),
            password: Yup.string()
                .required('No password provided')
                .min(4, 'Must be 4 characters at least'),
            email: Yup.string().email('Invalid email address').required('Required'),
        }),
        isSubmitting: false
    });


    const onSubmit = (values) => {
        formik.setSubmitting(true)
        setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            formik.setSubmitting(false)
        }, 1000)
    }

    const onUploadImg = async ({ target }) => {
        const field = 'avatar'
        const value = await cloudService.uploadImg(target.files[0])
        formik.values[field] = value
    }

    console.log('formik:', formik)
    return (
        <form onSubmit={formik.handleSubmit}>
            <VStack spacing='1em' fontSize='12px'>
                {isSignup &&
                    <FormControl w='100%' >
                        <Center w='100%' m='0'>
                            <FormLabel className='upload-avatar' htmlFor='input' m='0'>
                                <Icon as={ImUpload} />
                                <Tooltip label='Upload your own avatar' >
                                    <Image
                                        boxSize='100px'
                                        objectFit='cover'
                                        src={fields.avatar}
                                        alt='User Avatar'
                                        borderRadius='full'
                                    />
                                </Tooltip>
                            </FormLabel>
                        </Center>
                        <Input type='file' onChange={onUploadImg} className='file-input' id='input' />
                    </FormControl>
                }
                {isSignup &&
                    <FormControl isRequired isInvalid={formik.errors.alias}>
                        <FormLabel mb='0'>Alias:</FormLabel>
                        <Input id="alias" type="text" {...formik.getFieldProps('alias')} />
                        {formik.errors.alias ?
                            (
                                <FormErrorMessage m='0' fontSize='0.7rem'>
                                    {formik.errors.alias}
                                </FormErrorMessage>
                            )
                            :
                            (
                                <FormHelperText m='0' fontSize='0.7rem'>
                                    This is your display name... you can change it later
                                </FormHelperText>
                            )}
                    </FormControl>
                }
                <FormControl isRequired isInvalid={formik.errors.email}>
                    <FormLabel mb='0'>Email:</FormLabel>
                    <Input id="email" type="email" {...formik.getFieldProps('email')} />
                    {formik.errors.email ?
                        (
                            <FormErrorMessage m='0' fontSize='0.7rem'>
                                {formik.errors.email}
                            </FormErrorMessage>
                        )
                        :
                        (
                            <FormHelperText m='0' fontSize='0.7rem'>
                                {isSignup ? 'Enter a fake email (no one is looking)' : 'Email you signed up with'}
                            </FormHelperText>
                        )}

                </FormControl>

                <FormControl isRequired isInvalid={formik.errors.password}>
                    <FormLabel mb='0'>Password:</FormLabel>
                    <InputGroup size='md'>
                        <Input
                            id='password'
                            type={show ? 'text' : 'password'}
                            {...formik.getFieldProps('password')}
                            size='md'
                            pr='4.5rem'
                        />
                        <InputRightElement width='4.5rem'>
                            <Button h='1.75rem' size='sm' onClick={handleClick}>
                                {show ? 'Hide' : 'Show'}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                    {formik.errors.password ?
                        (
                            <FormErrorMessage m='0' fontSize='0.7rem'>
                                {formik.errors.password}
                            </FormErrorMessage>
                        )
                        :
                        (
                            <FormHelperText m='0' fontSize='0.7rem'>
                                Your super secret password...shhh
                            </FormHelperText>
                        )}

                </FormControl>
                <Button
                    type='submit'
                    width='100%'
                    colorScheme='whatsapp'
                    isLoading={formik.isSubmitting}
                >
                    {isSignup ? 'Sign Up' : 'Enter ChatApp'}
                </Button>
            </VStack>
        </form>
    )
}