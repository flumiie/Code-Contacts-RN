import React, { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { getContactsList } from '../../store/actions';
import { FloatingAddButton, Form, List, Loading, Spacer } from '../components';
import { ContactProps, ContactProps_Data } from '../types/dataTypes';

const RenderContactItem = ({ item }: { item: ContactProps_Data }) => {
  const navigation = useNavigation();

  if (item) {
    const { id, firstName, lastName, photo } = item;

    return (
      <List
        leftImage={photo}
        label={`${firstName} ${lastName}`}
        onPress={() => {
          navigation.navigate('ContactDetails', { id });
        }}
      />
    );
  }
};

export default ({ route, navigation }) => {
  const isFocused = useIsFocused();
  const [search, setSearch] = useState('');
  const [calls, setCalls] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { data: contactsListQuery } = useSelector(
    (state: any) => state.contactsList,
  );
  const contactsListData = useMemo<ContactProps>(() => {
    return {
      message: contactsListQuery?.message,
      data: contactsListQuery?.data
        ?.sort((a, b) => {
          if (a.firstName < b.firstName) {
            return -1;
          }
          if (a.firstName > b.firstName) {
            return 1;
          }
          return 0;
        })
        .map(item =>
          `${item.firstName} ${item.lastName}`
            .toLowerCase()
            .includes(search.toLowerCase())
            ? item
            : null,
        ),
    };
  }, [contactsListQuery, search]);

  const queryContactsHandler = () => {
    setLoading(true);

    if (!calls) {
      dispatch(
        getContactsList({
          onSuccess: () => setLoading(false),
          onError: () => setLoading(false),
        }),
      );
    }
  };

  useEffect(() => {
    setCalls(false);
  }, [isFocused]);

  useEffect(() => {
    if (contactsListData && !calls) {
      setCalls(true);
    }
  }, [contactsListData, calls]);

  useEffect(() => {
    if (!calls) {
      queryContactsHandler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calls]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <Form
          pressable={false}
          input={search}
          onChangeText={v => setSearch(v)}
        />
        <Spacer height={24} />
        <Spacer width={Dimensions.get('window').width} style={styles.border} />
        {loading ? (
          <Loading />
        ) : (
          <>
            <FlatList
              data={contactsListData.data}
              renderItem={({ item }) => <RenderContactItem item={item} />}
              keyExtractor={item => `${item?.id}-${Math.random() * 123}`}
            />
            <FloatingAddButton
              onPress={() => {
                navigation.navigate('NewContact');
              }}
            />
          </>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  border: {
    borderColor: '#eee',
    borderBottomWidth: 1,
  },
  buttonNavigateToSearch: {
    position: 'absolute',
    backgroundColor: 'red',
    flex: 1,
    width: '100%',
    height: 46,
    justifyContent: 'center',
  },
});
