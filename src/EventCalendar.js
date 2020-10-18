// @flow
import {
  VirtualizedList,
  View,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';

import styleConstructor from './style';

import DayView from './DayView';
const LEFT_MARGIN = 50 - 1;

var indexss = '';
export default class EventCalendar extends React.Component {
  constructor(props) {
    super(props);

    const start = props.start ? props.start : 0;
    const end = props.end ? props.end : 24;

    this.styles = styleConstructor(props.styles, (end - start) * 100);
    this.state = {
      date: moment(this.props.initDate),
      index: this.props.size,
    };
  }

  componentDidMount() {
    if (this.props.onRef) {
      this.props.onRef(this);
    }
  }

  componentWillUnmount() {
    if (this.props.onRef) {
      this.props.onRef(undefined);
    }
  }

  static defaultProps = {
    size: 30,
    initDate: new Date(),
    formatHeader: 'DD MMMM YYYY',
  };

  _getItemLayout(data, index) {
    const { width } = this.props;
    return { length: width, offset: width * index, index };
  }

  _getItem(events, index) {
    const date = moment(this.props.initDate).add(
      index - this.props.size,
      'days'
    );

    return _.filter(events, event => {
      const eventStartTime = moment(event.start);
      return (
        eventStartTime >= date.clone().startOf('day') &&
        eventStartTime <= date.clone().endOf('day')
      );
    });

  }

  _renderItem({ index, item }) {
    const {
      width,
      format24h,
      initDate,
      scrollToFirst = true,
      start = 0,
      end = 24,
      formatHeader,
      upperCaseHeader = false,
      stylists
    } = this.props;
    const date = moment(initDate).add(index - this.props.size, 'days');
    indexss = date;
    const leftIcon = this.props.headerIconLeft ? (
      this.props.headerIconLeft
    ) : (
        <Image source={require('./back.png')} style={this.styles.arrow} />
      );
    const rightIcon = this.props.headerIconRight ? (
      this.props.headerIconRight
    ) : (
        <Image source={require('./forward.png')} style={this.styles.arrow} />
      );

    let headerText = upperCaseHeader
      ? date.format('DD-MM-YYYY').toUpperCase()
      : date.format('DD-MM-YYYY');
    var arrayOfWeekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    var dateObj = new Date(date)
    var weekdayNumber = dateObj.getDay()
    var weekdayName = arrayOfWeekdays[weekdayNumber]
    // alert(headerText)
    return (
      <View style={[this.styles.container, { width }]}>
        <View style={this.styles.header}>
          <TouchableOpacity

style={{  borderColor:'#70757A',
borderRadius:10,
marginRight:2,
paddingHorizontal:5,
paddingVertical:1,
borderWidth:1,
alignItems:'center',}}
            onPress={() => {

              var initDate = moment(this.props.initDate)
                .format('YYYY-MM-DD')
              var currntdate = moment(new Date).format('YYYY-MM-DD');
              //  this.props.onTodayTapped(date)
              if (initDate == currntdate) {
                this.refs.calendar.scrollToIndex({ index: this.props.size, animated: true })
                this.props.dateChanged(
                  currntdate
                );
              } else {
                this.props.onTodayTapped(currntdate)


              }



            }}
          >
            <Text style={this.styles.headertodayText}>{"Today"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={this.styles.arrowButton}
            onPress={this._previous}
          >
            {leftIcon}
          </TouchableOpacity>
          <TouchableOpacity
            style={this.styles.headerTextContainer}
            onPress={() => {
              this.props.onDateTapped(headerText)

              // this._goToDate('2020-12-30')
            }}

          >
            <View >
              <Text style={this.styles.headerText}>{weekdayName + " " + headerText}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={this.styles.arrowButton}

            onPress={this._next}

          >
            {rightIcon}
          </TouchableOpacity>


        </View>
        <View style={{ flexDirection: 'row', height: 25, marginTop: 10 }}>

          {stylists.map((item, i) => (

            <View style={{ height: 25, flex: 1, marginLeft: i == 0 ? LEFT_MARGIN : 0, flexDirection: 'row', }}>
              {/* <Text style={[this.styles.headerText, { fontSize: 11, textAlign: 'center', paddingTop: 5, paddingBottom: 2,borderColor:'black',borderRadius:10,borderWidth:1 }]}
                numberOfLines={1}
              >{item.title}</Text> */}


              <View
                key={`timeNow`}
                style={[

                  {
                    flex: 1,
                    height: 20,
                    borderColor: '#70757A',
                    borderRadius: 10,
                    marginHorizontal: 2,
                    borderWidth: 1,
                    alignItems: 'center',

                    width: 45,
                  },
                ]}
              >
                <Text
                  key={`timeLabel`}
                  numberOfLines={1}
                  style={{

                    color: 'black',
                    fontSize: 11,
                  }}
                >
                  {item.title}
                </Text>
              </View>

              {/* <View style={{ height:35,borderRightWidth:1,borderColor:"#70757A" }}></View> */}
            </View>
          ))}


        </View>
        <DayView
          date={date}
          index={index}
          format24h={format24h}
          formatHeader={this.props.formatHeader}
          headerStyle={this.props.headerStyle}
          renderEvent={this.props.renderEvent}
          eventTapped={this.props.eventTapped}
          emptyEventTapped={this.props.emptyEventTapped}
          events={item}
          stylists={stylists}
          width={width}
          styles={this.styles}
          scrollToFirst={scrollToFirst}
          start={start}
          end={end}

        />
      </View>
    );
  }

  _goToPage(index) {
    if (index <= 0 || index >= this.props.size * 2) {
      return;
    }
    const date = moment(this.props.initDate).add(
      index - this.props.size,
      'days'
    );
    this.refs.calendar.scrollToIndex({ index, animated: false });
    this.setState({ index, date });
  }

  _goToDate(date) {
    const earliestDate = moment(this.props.initDate).subtract(
      this.props.size,
      'days'
    );
    const index = moment(date).diff(earliestDate, 'days');
    this._goToPage(index);
  }

  _previous = () => {
    this._goToPage(this.state.index - 1);
    if (this.props.dateChanged) {
      this.props.dateChanged(
        moment(this.props.initDate)
          .add(this.state.index - 1 - this.props.size, 'days')
          .format('YYYY-MM-DD')
      );
    }

  };


  _next = () => {
    this._goToPage(this.state.index + 1);
    if (this.props.dateChanged) {
      this.props.dateChanged(
        moment(this.props.initDate)
          .add(this.state.index + 1 - this.props.size, 'days')
          .format('YYYY-MM-DD')
      );
    }

  };

  render() {
    const {
      width,
      virtualizedListProps,
      events,
      initDate,
      stylists

    } = this.props;

    return (
      <View style={[this.styles.container, { width }]}>
        <VirtualizedList

          ref="calendar"

          showsHorizontalScrollIndicator={true}
          windowSize={2}
          initialNumToRender={2}
          initialScrollIndex={this.props.size}
          data={events}
          getItemCount={() => this.props.size * 2}
          getItem={this._getItem.bind(this)}
          keyExtractor={(item, index) => index.toString()}
          getItemLayout={this._getItemLayout.bind(this)}
          horizontal
          pagingEnabled
          renderItem={this._renderItem.bind(this)}
          style={{ width: width }}
          onMomentumScrollEnd={event => {
            const index = parseInt(event.nativeEvent.contentOffset.x / width);
            const date = moment(this.props.initDate).add(
              index - this.props.size,
              'days'
            );
            if (this.props.dateChanged) {
              this.props.dateChanged(date.format('YYYY-MM-DD'));
            }
            this.setState({ index, date });

          }}
          {...virtualizedListProps}
        />
      </View>
    );
  }
}
