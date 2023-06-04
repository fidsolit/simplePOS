import { useState } from 'react';
import { UserNS } from '../types';
import { signup } from '../services';
import { useNavigate } from 'react-router-dom';

interface IFormEvent {
    preventDefault(): void;
    target: {
        name: {
            value: string;
            validity: {
                valid: boolean;
            };
        },
        email: {
            value: string;
            validity: {
                valid: boolean;
            };
        },
        password: {
            value: string;
            validity: {
                valid: boolean;
            };
        },
        passwordConfirmation: {
            value: string;
            validity: {
                valid: boolean;
            };
        },
        validity: any;
    };
}

export interface ISignupState {
    name: { value: string; valid: 'valid' | 'invalid'; };
    email: { value: string; valid: 'valid' | 'invalid'; };
    password: { value: string; valid: 'valid' | 'invalid'; };
    passwordConfirmation: { value: string; valid: 'valid' | 'invalid'; };
    image?: string;
    checked: boolean;
}

const initialState: ISignupState = {
    email: { value: '', valid: 'valid' },
    name: { value: '', valid: 'valid' },
    password: { value: '', valid: 'valid' },
    passwordConfirmation: { value: '', valid: 'valid' },
    checked: false,
};

const useSignUp = () => {
    const [inputState, setInputState] = useState<ISignupState>(initialState);
    const navigate = useNavigate();

    const convertBase64 = (file: any) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                return resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                return reject(error);
            };
        });
    };

    const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        let file;
        file = event.target.files ? event.target.files[0] : '';
        const base64 = await convertBase64(file) as string;
        setInputState((oldState) => ({ ...oldState, image: base64 }));
    };

    const addUser = async (event: IFormEvent) => {
        event.preventDefault();

        const nameInput = document.getElementById('nameInSignUp') as any;
        const emailInput = document.getElementById('emailInSignUp') as any;
        const passwordInput = document.getElementById('passwordInSignUp') as any;
        const passwordConfirmationInput = document.getElementById('passwordConfirmationInSignUp') as any;

        let match: boolean = true;
        match &&= (nameInput.validity.valid);
        match &&= (emailInput.validity.valid);
        match &&= (passwordInput.validity.valid);
        match &&= (passwordConfirmationInput.validity.valid && (passwordInput.value === passwordConfirmationInput.value));
        match &&= (inputState.checked);

        if (match) {
            const user: UserNS.User = {
                _id: '',
                fullName: inputState.name.value,
                email: inputState.email.value,
                password: inputState.password.value,
                image: inputState.image || '',
            };

            try {
                const addUser = await signup(user);
                if (addUser) {
                    alert('User is created successfully');
                    navigate('/', { replace: true });
                }
                else {
                    alert('User is not created, Invalid email');
                }
            } catch (error) {
                console.error(error);
                alert('User is not created, please try again');
            }
        }
        else {
            setInputState((oldState) => ({
                ...oldState,
                name: {
                    ...inputState.name,
                    valid: nameInput.validity.valid ? 'valid' : 'invalid',
                },
                email: {
                    ...inputState.email,
                    valid: emailInput.validity.valid ? 'valid' : 'invalid',
                },
                password: {
                    ...inputState.password,
                    valid: passwordInput.validity.valid ? 'valid' : 'invalid',
                },
                passwordConfirmation: {
                    ...inputState.passwordConfirmation,
                    valid: ((passwordConfirmationInput.validity.valid) && (inputState.passwordConfirmation.value === inputState.password.value))
                        ? 'valid' : 'invalid',
                },
            }));
            alert('User is not created, because of you not agree with out terms, Invalid name, email, or password');
        }
    };

    return {
        inputState,
        setInputState,
        uploadImage,
        addUser,
    };
};

export default useSignUp;