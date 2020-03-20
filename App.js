/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  RefreshControl,
  Image,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

const App = () => {
  const onRefresh = () => {
    setIsRefreshing(true);
    const url = `https://api.stackexchange.com/2.2/users?page=1&order=desc&sort=reputation&site=stackoverflow`;
    axios
      .get(url)
      .then(res => {
        setData(res.data.items);
        setIsRefreshing(false);
      })
      .catch(error => {
        setError({error: 'Something just went wrong'});
        setIsRefreshing(false);
      });
  };

  let page = 1;
  const [isloading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState({});
  useEffect(() => {
    fetchUser(page);
  }, []);

  const fetchUser = page => {
    //stackexchange User API url
    const url = `https://api.stackexchange.com/2.2/users?page=${page}&order=desc&sort=reputation&site=stackoverflow`;
    setIsLoading(true);
    axios
      .get(url)
      .then(res => {
        setData(res.data.items);
        setIsLoading(false);
      })
      .catch(error => {
        setError({error: 'Something just went wrong'});
        setIsLoading(false);
      });
  };
  if (isloading && page === 1) {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
        }}>
        <ActivityIndicator style={{color: '#000'}} />
      </View>
    );
  }

  const handleLoadMore = () => {
    if (!isloading) {
      page = page + 1;
      // fetchUser(page);
      //stackexchange User API url
      const url = `https://api.stackexchange.com/2.2/users?page=${page}&order=desc&sort=reputation&site=stackoverflow`;
      setIsLoading(true);
      axios
        .get(url)
        .then(res => {
          setData([...data, ...res.data.items]);
          setIsLoading(false);
        })
        .catch(error => {
          setError({error: 'Something just went wrong'});
          setIsLoading(false);
        });
    }
  };

  return (
    <View>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        keyExtractor={(item, index) => index.toString()}
        onEndReachedThreshold={0.4}
        onEndReached={handleLoadMore}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 2,
              width: '100%',
              backgroundColor: '#CED0CE',
            }}
          />
        )}
        ListFooterComponent={() => {
          if (!isloading) {
            return null;
          } else {
            return <ActivityIndicator style={{color: '#000'}} />;
          }
        }}
        data={data}
        extraData={(isloading, isRefreshing, error)}
        renderItem={({item}) => (
          <View
            style={{
              flexDirection: 'row',
              padding: 15,
              alignItems: 'center',
            }}>
            <Image
              source={{uri: item.profile_image}}
              style={{
                height: 50,
                width: 50,
                marginRight: 10,
              }}
            />
            <Text
              style={{
                fontSize: 18,
                alignItems: 'center',
                color: '#65A7C5',
              }}>
              {item.display_name}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});
