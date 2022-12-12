import React from 'react';
import { View, Text, StyleSheet, Linking, ScrollView } from 'react-native';

const PrivacyText = () => {
  const renderText = () => {
    return (
      <>
        <View style={styles.renderTextViewStyle}>
          <Text style={styles.rendetTextStyle}>
            Coforge exclusively created this app to be used by its employees
            only and Coforge respects the privacy of its employees. The privacy
            notice which explains how we collect, use, disclose, and safeguard
            personal information is part of data privacy framework. For further
            details, visit the following link to access the Coforge data privacy
            framework:
            <Text
              style={{ color: 'skyblue' }}
              onPress={() => {
                Linking.openURL('https://iengage.coforge.com/');
              }}
            >
              https://iengage.coforge.com/{' '}
            </Text>{' '}
            {'>'} Privacy & IS {'>'} Data Privacy. The app privacy policy does
            not apply to the third-party online/mobile store from which you
            install the Application. Coforge is not responsible for any of the
            data collected by any such third party
          </Text>
        </View>
        <View style={styles.renderTextViewStyle}>
          <Text style={styles.headingStyle}>
            COLLECTION OF YOUR INFORMATION
          </Text>
          <Text style={styles.rendetTextStyle}>
            Coforge may collect additional information through this app. The
            information Coforge may collect via the application depends on the
            content and materials you use, and includes:
          </Text>
        </View>

        <View style={styles.renderTextViewStyle}>
          <Text style={styles.headingStyle}>Geo-Location Information</Text>
          <Text style={styles.rendetTextStyle}>
            Coforge may request access or permission for geo location which you
            can use to mark your attendance during your visit to campus (Greater
            Noida/Gurgaon). Coforge will not track location-based information
            from your mobile device continuously.
          </Text>
        </View>

        <View style={styles.renderTextViewStyle}>
          <Text style={styles.headingStyle}>Mobile Device Camera Access</Text>
          <Text style={styles.rendetTextStyle}>
            Coforge may request access or permission of your mobile device
            camera. The appropriate bills could be uploaded using this option
            during the creation of the voucher. If you wish to change app’s
            access or permissions, you may do so in your device’s settings. If
            you have a question or a complaint about this Privacy Notice,
            Coforge global privacy standards, or its information handling
            practices, you can reach DPMCG at{' '}
            <Text
              style={{ color: 'skyblue' }}
              onPress={() => {
                Linking.openURL(
                  'mailto:privacy@coforge.com?subject=SendMail&body=Description'
                );
              }}
            >
              privacy@coforge.com
            </Text>{' '}
            or DPO at (dpo@coforge.com).
          </Text>
        </View>
      </>
    );
  };
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: '#fff' }}
    >
      {renderText()}
    </ScrollView>
  );
};

export default PrivacyText;
const styles = StyleSheet.create({
  renderTextViewStyle: {
    marginBottom: 15,
  },
  rendetTextStyle: {
    textAlign: 'justify',
    marginVertical: 10,
  },
  headingStyle: {
    fontSize: 16,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
});
