"use client";
import styled from "styled-components";

export const LoginContainer = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f9fafb;
    padding: 3rem 1rem;
`;

export const LoginCard = styled.div`
    max-width: 28rem;
    width: 100%;
    background-color: white;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

export const LoginLogo = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const LoginHeader = styled.div`
    margin-bottom: 2rem;
`;

export const LoginTitle = styled.h2`
    margin-top: 1.5rem;
    text-align: center;
    font-size: 1rem;
    font-weight: 700;
    color: #1f2937;
`;

export const LoginForm = styled.form`
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

export const InputGroup = styled.div`
    border-radius: 0.375rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

export const InputField = styled.div`
    position: relative;

    &:first-child input {
        border-top-left-radius: 0.375rem;
        border-top-right-radius: 0.375rem;
    }

    &:last-child input {
        border-bottom-left-radius: 0.375rem;
        border-bottom-right-radius: 0.375rem;
    }
`;

export const Input = styled.input`
    appearance: none;
    position: relative;
    display: block;
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    color: #1f2937;

    &::placeholder {
        color: #9ca3af;
    }

    &:focus {
        outline: none;
        z-index: 10;
        border-color: #6366f1;
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
    }
`;

export const ErrorMessage = styled.p`
    color: #ef4444;
    font-size: 0.875rem;
    text-align: center;
    margin-top: 0.5rem;
`;

export const ActionRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const RememberMeContainer = styled.div`
    display: flex;
    align-items: center;
`;

export const Checkbox = styled.input`
    height: 1rem;
    width: 1rem;
    color: #6366f1;
    border-radius: 0.25rem;
    border-color: #d1d5db;

    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
    }
`;

export const CheckboxLabel = styled.label`
    margin-left: 0.5rem;
    display: block;
    font-size: 0.875rem;
    color: #1f2937;
`;

export const ForgotPasswordContainer = styled.div`
    font-size: 0.875rem;
`;

export const ForgotPasswordLink = styled.a`
    font-weight: 500;
    color: #6366f1;

    &:hover {
        color: #4f46e5;
    }
`;

export const SubmitButton = styled.button`
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 0.5rem 1rem;
    border: 1px solid transparent;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 0.375rem;
    color: white;
    background-color: #6366f1;
    transition: background-color 0.2s;

    &:hover {
        background-color: #4f46e5;
    }

    &:focus {
        outline: none;
        box-shadow:
            0 0 0 2px white,
            0 0 0 4px #6366f1;
    }
`;
