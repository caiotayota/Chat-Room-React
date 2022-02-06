import { Box, Button, Image, Text } from "@skynexui/components";
import { useRouter } from "next/router";

import appConfig from "../config.json";

import Head from "next/head";

function IndexPage() {
    return (
        <Head>
            <title>Error 404 - Not Found</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
    );
}

export default function Custom404() {
    const roteamento = useRouter();

    return (
        <>
            <Box
                styleSheet={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: appConfig.theme.colors.primary[400],
                    backgroundImage: 'url(https://virtualbackgrounds.site/wp-content/uploads/2020/09/limmys-gamer-room-1536x864.jpg)',
                    backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                }}
            >
                <IndexPage />
                <Box
                    styleSheet={{

                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: "column",
                        height: '100%', maxHeight: '500px',
                        width: '100%', maxWidth: '700px',
                        borderRadius: '50px', padding: '32px', margin: '16px',
                        boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                        backgroundColor: appConfig.theme.colors.neutrals[900],
                        
                    }}
                >
                    <Image
                        styleSheet={{
                            height: "60%",
                        }}
                        src="https://i.postimg.cc/TwmD8Ds7/error404.gif"
                    ></Image>
                    
                    <Text
                        variant="heading2"
                        styleSheet={{
                            color: "#fff",
                            marginBottom: "10px",
                        }}
                    >
                        PAGE NOT FOUND
                    </Text>

                    <Button
                        type="submit"
                        label="Back to home page"
                        onClick={function (e) {
                            e.preventDefault;
                            roteamento.push("/");
                        }}
                     
                        buttonColors={{
                            contrastColor: appConfig.theme.colors.neutrals["000"],
                            mainColor: appConfig.theme.colors.primary[500],
                            mainColorLight: appConfig.theme.colors.primary[400],
                            mainColorStrong: appConfig.theme.colors.primary[600],
                        }}
                    />
                </Box>
            </Box>

        </>
    );
}