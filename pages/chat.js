import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzkxMjYzMCwiZXhwIjoxOTU5NDg4NjMwfQ.nX-raQTLU-G_yf2mbsX9s_749ssgg6s-2_Ukni04IIE';
const SUPABASE_URL = 'https://zynbypklbmmpsrwgocof.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function listenMessagesInRealtime(addMessage) {
    return supabaseClient
        .from('messages')
        .on('INSERT', (liveResponse) => {
            console.log(liveResponse);
            addMessage(liveResponse.new);
        })
        .subscribe();
}

export default function ChatPage() {
    const routing = useRouter();
    const loggedUser = routing.query.username;
    const [message, setMessage] = React.useState('');
    const [messagesList, setMessagesList] = React.useState([]);

    React.useEffect(() => {
        supabaseClient
            .from('messages')
            .select('*')
            .order('id', {ascending: false})
            .then(({ data }) => {
                // console.log('Fetched data', data)
               setMessagesList(data)
        });

        const subscription = listenMessagesInRealtime((newMessage) => {
            setMessagesList((listCurrentValue) => {
                console.log('listCurrentValue:', listCurrentValue);
                return [
                    newMessage,
                    ...listCurrentValue,
                ]
            });
        });

        return () => {
            subscription.unsubscribe();
        }

    }, [])



    function handleNewMessage(newMessage) {
        const message = {
            //id: messagesList.length + 1,
            from: loggedUser,
            text: newMessage,
        };

        supabaseClient
            .from('messages')
            .insert([message]) // Must be an object with the same fields that have been wrote on supabase
            .then(({data}) => {
                console.log('Creating message: ', data)
            });
            
        setMessage('');
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/camping-near-mount-gongga-1536x864.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    <MessageList messages={messagesList} />
                    <ButtonSendSticker
                        onStickerClick = {(sticker) => {
                            console.log("save on database");
                            handleNewMessage(`:sticker: ${sticker}`)

                        }}
                    />
                    <Box
                        as="form"

                        onSubmit={function (event) {
                            event.preventDefault();
                            handleNewMessage(message)
                        }}

                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    > 
                        
                        <TextField
                            value={message}
                            onChange={(event) => {
                                const value = event.target.value;
                                setMessage(value);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleNewMessage(message);
                                }
                            }}
                            placeholder="Type your message here..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '5px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                            
                        />
                        
                        <Button
                            type='submit'
                            label='Send'
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors.primary[500],
                                mainColorLight: appConfig.theme.colors.primary[400],
                                mainColorStrong: appConfig.theme.colors.primary[600],
                            }}
                            styleSheet={{
                                height: '40px',
                                marginBottom: '8px'

                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    console.log(props);
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.messages.map((message) => {
                return (
                    <Text
                        key={message.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${message.from}.png`}
                            />
                            <Text tag="strong">
                                {message.from}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>
                        {message.text.startsWith(':sticker:')
                            ? ( <Image src={message.text.replace(':sticker:', '')}/> )
                            : (message.text)                        
                        }

                        {/* {message.text} */}
                    </Text>
                );
            })}
        </Box>
    )
}