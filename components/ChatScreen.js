// components/ChatScreen.js
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import Message from "./Message";

// Importa el árbol de decisiones desde el archivo JSON
import storyTree from "../storyTree.json";

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [options, setOptions] = useState([]);
  const flatListRef = useRef(null);

  const getRandomElement = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  };

  const handleSendMessage = (selectedOption) => {
    if (selectedOption) {
      // Mostrar la opción seleccionada como un mensaje enviado
      const selectedOptionMessage = {
        text: selectedOption.title,
        isUser: true,
      };
      setMessages((prevMessages) => [...prevMessages, selectedOptionMessage]);
      console.log("Usuario elige opción: ", selectedOptionMessage);

      // Actualizar el estado con la opción seleccionada
      setOptions([]);

      // Utilizar setTimeout para gestionar el tiempo de espera antes de mostrar la siguiente respuesta y opciones
      setTimeout(() => {
        console.log("Empieza cuenta atras de ", selectedOption.time + "s");

        // Obtén el próximo nodo basándote en nextId
        const nextNode = storyTree.nodes.find(
          (node) => node.id === selectedOption.nextId
        );

        if (nextNode) {
          // Establecer las opciones del próximo nodo
          setOptions(nextNode.options);
          console.log("Establecemos próximas opciones: ", nextNode.options);

          // Agregar el próximo mensaje como un mensaje recibido
          const nextMessageObject = { text: nextNode.message, isUser: false };
          setMessages((prevMessages) => [...prevMessages, nextMessageObject]);
          console.log("Pintamos respuesta: ", nextMessageObject);

          // Scroll automático hacia abajo al agregar un nuevo mensaje
          scrollToBottom();
        }
      }, selectedOption.time * 1000); // Convierte el tiempo a milisegundos
    }
  };

  // Ejemplos de mensajes recibidos
  const receivedMessages = [
    { text: storyTree.nodes[0].message, isUser: false }, // Inicia el árbol de decisiones
  ];

  // Agregar mensajes recibidos al estado inicial
  useEffect(() => {
    setMessages([...receivedMessages]);
    setOptions(storyTree.nodes[0].options || []);
    scrollToBottom();
  }, []);

  // Scroll automático hacia abajo al agregar un nuevo mensaje
  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Message text={item.text} isUser={item.isUser} />
        )}
        onContentSizeChange={() => scrollToBottom()}
      />
      <View style={styles.optionsContainer}>
        <FlatList
          data={options}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                handleSendMessage(item);
              }}
            >
              <Text style={styles.optionText}>{item.title}</Text>
            </TouchableOpacity>
          )}
          numColumns={1}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: "#3498db",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  optionText: {
    color: "white",
    fontSize: 16,
  },
});

export default ChatScreen;
