import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image, LayoutAnimation, ScrollView, UIManager } from 'react-native';
import { moderateScale } from '../../components/fontScaling';
const { height } = Dimensions.get('window');
let globalConstants = require('../../GlobalConstants');
import { globalFontStyle } from '../../components/globalFontStyle.js';
import { render } from 'enzyme';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { styles } from './styles';

export class DetailHistoryPanel extends Component {
	constructor(props) {
		super(props);
		if (Platform.OS === 'android') {
			UIManager.setLayoutAnimationEnabledExperimental(true);
		  }
		this.state = {
			active_index: -1,
			updatedHeight: 0,
			expand: false,
		};
	}
	expand_collapse_Function = (i) => {
		console.log('Expand collapse clicked ', i, this.state.active_index);
		LayoutAnimation.configureNext({
			duration: 300,
			create: {
			  type: LayoutAnimation.Types.easeInEaseOut,
			  property: LayoutAnimation.Properties.opacity,
			},
			update: { type: LayoutAnimation.Types.easeInEaseOut },
		  });
		if (i == this.state.active_index) {
			this.setState({
				active_index: -1,
				updatedHeight: 0,
				expand: false,
			});
		} else {
			this.setState({
				active_index: i,
				updatedHeight: 150,
				expand: true,
			});
		}
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<View style={{ flexDirection: 'row' }}>
					<TouchableOpacity
						onPress={(value) =>
							this.expand_collapse_Function(this.props.index, this.state.active_index)
						}
						style={{ alignItems: 'center' }}>
						{this.state.active_index === this.props.index ? (
							<Text
								style={{
									fontSize: moderateScale(26),
									marginHorizontal: moderateScale(0),
									fontWeight: 'bold',
								}}>
								{' '}
								-{' '}
							</Text>
						) : (
							<Text
								style={{
									fontSize: moderateScale(26),
									marginHorizontal: moderateScale(0),
									fontWeight: 'bold',
								}}>
								{' '}
								+{' '}
							</Text>
						)}
					</TouchableOpacity>
					<View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
						<TouchableOpacity
							onPress={(value) => this.props.openNewPanel(this.props.item)}
							style={{ alignItems: 'center', justifyContent: 'center' }}>
							{this.props.needHistory === undefined ?
							<Image source={globalConstants.HISTORY_ICON} style={globalFontStyle.historyIcon} />
							 : null}

						</TouchableOpacity>
					</View>
				</View>
                {this.state.active_index === this.props.index ? this.props.children : null}
			</View>
		);
	}
}
