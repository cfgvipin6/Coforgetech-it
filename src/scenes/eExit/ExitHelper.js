import { styles } from './styles';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import React, { Component } from 'react';
import { Icon, Button, SearchBar, Card } from 'react-native-elements';
import RadioForm from 'react-native-simple-radio-button';
import {
  RESIGNATION_SUBMIT_DATE,
  REQUESTED_LWD,
  REASON_RESIGNATION,
  NP_REQUIRED,
  NP_SERVED,
  SHORT_FALL,
  RESIGNATION_TITLE,
  LWD,
  NP_TREATMENT,
  RESIGNATION_TYPE,
  DOWN_ICON,
  PLANNED_SEPARATION,
} from './constants';
export const ResignationDetails = (props) => {
  console.log('Exit props', props);
  return (
    <Card title={RESIGNATION_TITLE}>
      <View style={styles.rowHolder}>
        <Text style={styles.heading}>{RESIGNATION_SUBMIT_DATE}</Text>
        <Text style={styles.description}>{props.exitItem.dt_resignation}</Text>
      </View>
      {/* <View style={styles.rowHolder}>
        <Text style={styles.heading}>{REQUESTED_LWD}</Text>
        <Text style={styles.description}>{props.exitItem.dt_requested_lwd}</Text>
      </View> */}
      <View style={styles.rowHolder}>
        <Text style={styles.heading}>{LWD}</Text>
        <Text style={styles.description}>{props.lwd}</Text>
      </View>
      <View style={styles.rowHolder}>
        <Text style={styles.heading}>{REASON_RESIGNATION}</Text>
        <Text style={styles.description}>{props.exitItem.vc_rsg_rsn_sm}</Text>
      </View>
      <View style={styles.rowHolder}>
        <Text style={styles.heading}>{NP_REQUIRED}</Text>
        <Text style={styles.description}>
          {props.noticePeriod === ''
            ? props.exitItem.in_notice_reqd
            : props.noticePeriod.strNPreqd}
        </Text>
      </View>
      <View style={styles.rowHolder}>
        <Text style={styles.heading}>{NP_SERVED}</Text>
        <Text style={styles.npServedText}>
          {props.noticePeriod === ''
            ? props.exitItem.in_notice_served
            : props.noticePeriod.npserv}
        </Text>
      </View>
      <View style={styles.rowHolder}>
        <Text style={styles.heading}>{SHORT_FALL}</Text>
        <Text style={styles.shortFallText}>
          {props.noticePeriod === ''
            ? props.exitItem.in_notice_short
            : props.noticePeriod.npshort}
        </Text>
      </View>
    </Card>
  );
};

export const RadioForms = (props) => {
  let disabledRadio = false;
  let appliedStyle =
    props.labelHorizontal === true ? styles.radioButtonHolder : null;
  let centerStyle = styles.radioButtonHolderWithoutTitle;
  let initialVal = parseInt(props.selectedVal);
  if (props.title === 'Resignation type') {
    initialVal = initialVal - 1;
    disabledRadio = true;
  }
  if (props.title === NP_TREATMENT) {
  }
  if (props.exitItem && props.exitItem.isApprovingAuth === 'N') {
    //planned separation case
    disabledRadio = true;
  }
  if (props.selectedVal === 'Y') {
    initialVal = 0;
  }
  if (props.selectedVal === 'N') {
    initialVal = 1;
    // disabledRadio=true;
  }
  if (props.selectedVal && props.selectedVal === '') {
    initialVal = 1;
  }
  if (props.title === PLANNED_SEPARATION && props.selectedVal === 'N') {
    initialVal = 1;
  }
  // console.log("Initial val for title : ",props.title+" ",initialVal);
  return (
    <View style={props.title != undefined ? appliedStyle : centerStyle}>
      {props.title != undefined ? (
        <Text style={styles.boldText}>{props.title}</Text>
      ) : null}
      {props.title != undefined ? (
        <View
          style={
            disabledRadio
              ? styles.radioGroupDisabledContainer
              : styles.radioGroupContainer
          }
        >
          <RadioForm
            style={{ marginHorizontal: 15 }}
            ref={props.forwardedRef}
            radio_props={props.options}
            disabled={
              props.disabled !== undefined ? props.disabled : disabledRadio
            }
            initial={initialVal}
            formHorizontal={props.title === NP_TREATMENT ? false : true}
            labelHorizontal={props.labelHorizontal}
            buttonSize={10}
            buttonOuterSize={20}
            labelStyle={{ paddingHorizontal: 8, fontSize: 12 }}
            onPress={(value) => {
              props.onValueSelection(value);
            }}
          />
        </View>
      ) : (
        <View>
          <RadioForm
            style={{ marginHorizontal: 15 }}
            radio_props={props.options}
            // disabled={disabledRadio}
            ref={props.forwardedRef}
            disabled={
              props.disabled !== undefined ? props.disabled : disabledRadio
            }
            initial={initialVal}
            formHorizontal={props.title === NP_TREATMENT ? false : true}
            labelHorizontal={props.labelHorizontal}
            buttonSize={10}
            buttonOuterSize={20}
            labelStyle={{ paddingHorizontal: 8, fontSize: 12 }}
            onPress={(value) => {
              props.onValueSelection(value);
            }}
          />
        </View>
      )}
    </View>
  );
};

export const TreatmentRadioForms = (props) => {
  let disabledRadio = false;
  let appliedStyle =
    props.labelHorizontal === true ? styles.treatmentHolder : null;
  let initialVal = parseInt(props.selectedVal);
  // console.log("Initial val for title : ",props.title+" ",initialVal);
  return (
    <View style={appliedStyle}>
      <Text style={styles.boldText}>{props.title}</Text>
      <View
        style={
          disabledRadio
            ? styles.radioGroupDisabledRecommended
            : styles.radioGroupContainerRecommended
        }
      >
        <RadioForm
          style={{ marginHorizontal: 15 }}
          radio_props={props.options}
          disabled={disabledRadio}
          initial={initialVal}
          formHorizontal={props.title === NP_TREATMENT ? false : true}
          labelHorizontal={props.labelHorizontal}
          buttonSize={10}
          buttonOuterSize={20}
          labelStyle={{ marginRight: 18, fontSize: 12 }}
          onPress={(value) => {
            props.onValueSelection(value);
          }}
        />
      </View>
    </View>
  );
};

export const Skills = (props) => {
  let skills = props.skillData;
  let skillName;
  skills.map((element) => {
    if (props.skillSelected === element.ID) {
      skillName = element.SkillName;
    }
  });
  return (
    <View>
      <View style={styles.halfHolder}>
        <Text style={styles.skillsHeading}>Select skills</Text>
        <TouchableOpacity
          style={styles.skillText}
          onPress={() => {
            props.searchCallBack();
          }}
        >
          <View style={styles.selectSkillInnerView}>
            <Text style={styles.textOtherStyle}>{skillName}</Text>
            <Image source={DOWN_ICON} style={styles.downIconStyle} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
renderSkillItem = (item, index, pickSkill) => {
  return (
    <TouchableOpacity
      onPress={() => {
        pickSkill(item);
      }}
      style={styles.listItem}
    >
      <Text>{item.SkillName}</Text>
      <View style={styles.supervisorSeparator} />
    </TouchableOpacity>
  );
};
showSkillRequestsView = (parent) => {
  if (parent.skillData.length > 0) {
    return (
      <FlatList
        data={parent.skillData}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) =>
          this.renderSkillItem(item, index, parent.pickSkill)
        }
        keyExtractor={(item, index) => 'pendingRequest_' + index.toString()}
        // ItemSeparatorComponent={() => (
        //   <View style={{ backgroundColor: "white" }}>
        //     <Text></Text>
        //   </View>
        // )}
      />
    );
  } else {
    return null;
  }
};

export const EditTextWithHeading = (parent) => {
  return (
    <View>
      <Text style={styles.reasonHeading}>{parent.title}</Text>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        autoCompleteType="off"
        placeholder="Remarks"
        multiline={false}
        style={styles.reasonInputStyle}
        onChangeText={(text) => {
          parent.reasonRemarks(text);
        }}
      />
    </View>
  );
};

export const SkillSearchView = (parent) => {
  return (
    <View>
      <Modal
        visible={parent.visibility}
        animationType="slide"
        transparent={false}
        onRequestClose={() => {
          parent.closeCallBack();
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.searchHolder}>
            <SearchBar
              lightTheme
              placeholder="Search skills"
              onChangeText={parent.search()}
              value={parent.query}
              raised={true}
              containerStyle={styles.searchBarSkills}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => {
                parent.closeCallBack();
              }}
            >
              <Icon name="close" size={35} color="blue" />
            </TouchableOpacity>
          </View>
          {this.showSkillRequestsView(parent)}
        </View>
      </Modal>
    </View>
  );
};
