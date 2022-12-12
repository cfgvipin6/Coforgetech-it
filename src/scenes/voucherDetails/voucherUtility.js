import { View, TextInput } from 'react-native';
import { styles } from './styles';

export const renderRemarksView = (refs) => {
  return (
    <View style={styles.remarksParent}>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        autoCompleteType="off"
        multiline={true}
        maxLength={200}
        onChangeText={(text) => refs.setState({ remarks: text })}
        value={refs.state.remarks}
        placeholder="Remarks"
        style={{
          width: '100%',
          paddingLeft: 10,
          paddingTop: 10,
          paddingBottom: 10,
        }}
      />
    </View>
  );
};
