import React, { useState, useEffect } from "react";
import api from './services/api';

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('/repositories').then(res => {
      setRepositories(res.data);
    });
  }, []);

  async function handleLikeRepository(id) {
    const res = await api.post(`/repositories/${id}/like`)

    const likes = res.data

    const updatedRepositories = repositories.map(repositoryItem => {
      if(repositoryItem.id === id) {
        return likes
      }else {
      return repositoryItem
      }
    });
    setRepositories(updatedRepositories)
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={repositoryItem => repositoryItem.id}
          renderItem={({ item: repositoryItem }) => (
            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>{repositoryItem.title}</Text>
              <View style={styles.techsContainer}>
                {repositoryItem.techs.map(tech => (
                  <Text key={tech} style={styles.tech}>
                    {[tech]}
                  </Text>
                ))}
              </View>
              <View style={styles.likesContainer}>
                {repositoryItem.likes > 1 ? (
                  <Text
                    style={styles.likeText}
                    testID={`repository-likes-${repositoryItem.id}`}
                  >
                    {repositoryItem.likes} curtidas
                  </Text>
                ) : <Text
                  style={styles.likeText}
                  testID={`repository-likes-${repositoryItem.id}`}
                   >
                    {repositoryItem.likes} curtida
                  </Text>}
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repositoryItem.id)}
                testID={`like-button-${repositoryItem.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
