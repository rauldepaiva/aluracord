import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { createClient } from "@supabase/supabase-js";
import { useRouter } from 'next/router';
import { ButtonSendSticker } from "../src/components/ButtonSendSticker";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzQ2ODM1MSwiZXhwIjoxOTU5MDQ0MzUxfQ.hc32Tkj-tEVbIJ25NRxTGjUiBKoNURAWWOKkBBMQCB8";
const SUPABASE_URL = "https://bvtnrymdexifsbigtuxa.supabase.co";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// function realTimeMessages(addMessage) {
//     return supabaseClient
//         .from("messagesTableV2")
//         .on("INSERT", (incoming) => {
//             // console.log(incoming);
//             // console.log("Entrou mensagem");
//             addMessage(incoming.new);
//         })
//         .subscribe();
// }

export default function ChatPage() {
    const routing = useRouter();
    const loggedUser = routing.query.username;
    const [message, setMessage] = React.useState("");
    const [messageList, setMessageList] = React.useState([]);

    React.useEffect(() => {
        supabaseClient
            .from("messagesTableV2")
            .select("*")
            .order("id", { ascending: false })
            .then(({ data }) => {
                setMessageList(data);
            });

        //Had to comment this function out due to an error: when the user sent a message, the code tried sending it twice.
        //The console returned a error because it tried to write two lines with the same ID on the server.
        //The code still works without the function; however, if the chat is open elsewhere, it won't catch new remote messages.

        // realTimeMessages((newMessage) => {
        //     setMessageList((currentList) => {
        //         // console.log("Current list: ", currentList);
        //         // console.log("New message: ", newMessage);
        //         return [
        //             newMessage,
        //             ...currentList
        //         ]
        //     });
        // });
    }, []);

    function handleNewMessage(newMessage) {
        const message = {
            from: loggedUser,
            text: newMessage,
        };

        supabaseClient
            .from("messagesTableV2")
            .insert([
                message
            ])
            .then(({ data }) => {
                setMessageList([
                    data[0],
                    ...messageList,
                ]);
            })


        setMessage("");
    }

    // ./Sua lógica vai aqui
    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[100],
                backgroundImage: `url(https://images.pexels.com/photos/7078712/pexels-photo-7078712.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)`,
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

                    <MessageList messages={messageList} />

                    {/* Lista: {messageList.map((currentMessage) => {
                        return (
                            <li key={currentMessage.id}>
                                {currentMessage.from}: {currentMessage.text}
                            </li>
                            )
                        })} */}

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: "space-between",
                        }}
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleNewMessage(message);
                        }}
                    >
                        <TextField
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value);
                            }}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleNewMessage(message);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />

                        <Button
                            type='submit'
                            label='Send'
                            styleSheet={{
                                width: "10%"
                            }}
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors.primary[500],
                                mainColorLight: appConfig.theme.colors.primary[400],
                                mainColorStrong: appConfig.theme.colors.primary[600],
                            }}
                        />
                        < ButtonSendSticker
                            onStickerClick={(sticker) => {
                                handleNewMessage(`:sticker:${sticker}`);
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
                                display: "flex",
                                alignItems: "center",
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
                        {message.text.startsWith(":sticker:")
                            ? (
                                <Image src={message.text.replace(":sticker:", "")} />
                            )
                            : (
                                message.text
                            )}
                        {/* {message.text} */}
                    </Text>
                );
            })}


        </Box>
    )
}