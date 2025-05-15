import { initialUrl } from "@lib/constants/AppConst";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect, RedirectType } from "next/navigation";
import {
    ErrorMessage,
    Input,
    InputField,
    InputGroup,
    LoginCard,
    LoginContainer,
    LoginForm,
    LoginHeader,
    LoginLogo,
    LoginTitle,
    SubmitButton,
} from "./index.styled";

export default function Login({ searchParams }: { searchParams: { error?: string } }) {
    async function handleLogin(formData: FormData) {
        "use server";

        const email = formData.get("email")?.toString();
        const password = formData.get("password")?.toString();

        if (!email || !password) {
            redirect("/login?error=missing_credentials");
        }

        // Authentication API call
        const response = await fetch(`${process.env.API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const { token, user, routes, permissions } = await response.json();

        if (!token) {
            redirect("/login?error=invalid_credentials");
        }

        // Set cookies correctly
        (await cookies()).set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60,
            path: "/",
        });
        (await cookies()).set({
            name: "user",
            value: JSON.stringify(user),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60,
            path: "/",
        });
        (await cookies()).set({
            name: "routes",
            value: JSON.stringify(routes),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60,
            path: "/",
        });
        (await cookies()).set({
            name: "permissions",
            value: JSON.stringify(permissions),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60,
            path: "/",
        });

        redirect(initialUrl, RedirectType.push);
    }

    return (
        <LoginContainer>
            <LoginCard>
                <LoginLogo>
                    <Image alt="logo" height={64} src="/assets/images/logo-with-name.png" width={64} />
                </LoginLogo>
                <LoginHeader>
                    <LoginTitle>Sign in to your account</LoginTitle>
                </LoginHeader>

                {searchParams.error && (
                    <ErrorMessage>
                        {searchParams.error === "missing_credentials"
                            ? "Email and password are required"
                            : searchParams.error === "invalid_credentials"
                              ? "Invalid email or password"
                              : "An error occurred"}
                    </ErrorMessage>
                )}

                <LoginForm action={handleLogin}>
                    <InputGroup>
                        <InputField>
                            <Input
                                type="email"
                                defaultValue="john.doe@gmail.com"
                                name="email"
                                id="email"
                                placeholder="Email address"
                                required
                            />
                        </InputField>
                        <InputField>
                            <Input
                                type="password"
                                defaultValue="password"
                                name="password"
                                id="password"
                                placeholder="Password"
                                required
                            />
                        </InputField>
                    </InputGroup>

                    {/* <ActionRow>
                        <RememberMeContainer>
                            <Checkbox type="checkbox" id="remember-me" name="remember-me" />
                            <CheckboxLabel htmlFor="remember-me">Remember me</CheckboxLabel>
                        </RememberMeContainer>

                        <ForgotPasswordContainer>
                            <ForgotPasswordLink href="/forgot-password">Forgot your password?</ForgotPasswordLink>
                        </ForgotPasswordContainer>
                    </ActionRow> */}

                    <SubmitButton type="submit">Sign in</SubmitButton>
                </LoginForm>
            </LoginCard>
        </LoginContainer>
    );
}
