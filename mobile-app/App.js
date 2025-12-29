import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, FlatList, ActivityIndicator } from 'react-native';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

const GET_ITEMS = gql`
  query GetItems {
    items {
      id
      name
      description
    }
  }
`;

const ItemList = () => {
  const { loading, error, data } = useQuery(GET_ITEMS);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <FlatList
      data={data.items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.title}>{item.name}</Text>
          <Text>{item.description}</Text>
        </View>
      )}
    />
  );
};

const App = () => {
  return (
    <ApolloProvider client={client}>
      <View style={styles.container}>
        <Text style={styles.header}>Item List</Text>
        <ItemList />
        <Button title="Refresh" onPress={() => {}} />
      </View>
    </ApolloProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default App;