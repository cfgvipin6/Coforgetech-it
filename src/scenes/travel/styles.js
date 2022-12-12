import { StyleSheet } from "react-native";
import { moderateScale } from "../../components/fontScaling.js";
let appConfig = require("../../../appconfig");
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    backgroundColor: "#FFFFFF",
    width: "90%",
    alignSelf: "center",
  },
  cardBackground: {
    borderWidth: 2,
    flex: 0,
    borderColor: "#f2f7ff",
    borderRadius: 5,
    shadowOffset: { width: 10, height: 10 },
    shadowColor: "black",
  },
  view_One: {
    flex: 0,
    marginHorizontal: moderateScale(6),
    paddingTop: moderateScale(2),
  },
  rowFashion: { flexDirection: "row" },
  rowFashion2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  collapseContainer: { flex: 0, flexDirection: "row" },
  collapseButton: { alignItems: "center", justifyContent: "center" },
  buttonsContainer: { flexDirection: "row" },
  button: { width: "50%" },
  view_Two: {
    marginHorizontal: moderateScale(6),
  },
  textOne: {
    width: "50%",
  },
  textTwo: {
    width: "50%",
  },
  textFive: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  textSix: {
    fontSize: moderateScale(26),
    marginHorizontal: moderateScale(0),
    fontWeight: "bold",
  },
  parentView: {
    flex: 1,
    backgroundColor: "white",
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: moderateScale(15),
    width: "100%",
  },
  actionText: {
    alignSelf: "flex-start",
    paddingLeft: 17,
    marginBottom: 5,
  },
  actionClick: {
    borderWidth: 1,
    borderColor: appConfig.LIST_BORDER_COLOUR,
    borderRadius: moderateScale(5),
    height: moderateScale(40),
    width: "90%",
    justifyContent: "center",
    paddingLeft: 10,
    backgroundColor: appConfig.APP_SKY,
  },
  requestorListContainer: {
    borderWidth: moderateScale(1),
    borderColor: appConfig.LIST_BORDER_COLOUR,
    borderRadius: moderateScale(5),
    width: "90%",
    alignSelf: "center",
  },
  separator: {
    tintColor: appConfig.BORDER_GREY_COLOR,
    height: moderateScale(1),
    width: "100%",
  },
  itemList: {
    backgroundColor: "white",
    flex: 1,
    width: "100%",
    height: moderateScale(40),
    justifyContent: "center",
    borderRadius: moderateScale(5),
  },
  selectedListClick: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: appConfig.LIST_BORDER_COLOUR,
    borderRadius: moderateScale(5),
    height: moderateScale(40),
    width: "90%",
    justifyContent: "center",
    paddingLeft: 10,
    marginLeft: moderateScale(18),
    backgroundColor: appConfig.APP_SKY,
  },
  pendingItem: {
    tintColor: appConfig.BORDER_GREY_COLOR,
    height: moderateScale(1),
    width: "100%",
  },
  remarksParent: {
    borderWidth: 1,
    borderColor: appConfig.LIST_BORDER_COLOUR,
    borderRadius: moderateScale(5),
    width: "90%",
    alignItems: "center",
    alignSelf: "center",
    marginTop: moderateScale(10),
  },
  customButtonContainer: {
    width: "90%",
    // alignItems: "flex-end",
    alignSelf: "center",
    position: "absolute",
    bottom: 10,
  },
  modalText: {
    marginHorizontal: "4.3%",
    fontSize: moderateScale(14),
    color: appConfig.GUN_METAL_COLOR,
    letterSpacing: moderateScale(0.7),
    textAlign: "center",
  },
  subViewTextOne: {
    width: "50%",
  },
  subViewTextTwo: {
    width: "50%",
  },
  bottomButtonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginTop: "2%",
  },
  cardStyle: {
    flex: 0,
    marginHorizontal: moderateScale(6),
    paddingTop: moderateScale(2),
  },
});
