// @flow
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import populateEvents from './Packer';
import React from 'react';
import moment from 'moment';
import _ from 'lodash';

const LEFT_MARGIN = 50 - 1;
// const RIGHT_MARGIN = 10
const CALENDER_HEIGHT = 2400;
// const EVENT_TITLE_HEIGHT = 15
const TEXT_LINE_HEIGHT = 17;
// const MIN_EVENT_TITLE_WIDTH = 20
// const EVENT_PADDING_LEFT = 4
let { width,height } = Dimensions.get('window')
function range(from, to) {
  return Array.from(Array(to), (_, i) => from + i);
}

var itemWidth = 0;
var start;
var calendarHeight=0;
export default class DayView extends React.PureComponent {
  constructor(props) {
    super(props);
    calendarHeight = (props.end - props.start) * 100;

    const width = (props.width - LEFT_MARGIN) / props.stylists.length;
    itemWidth = width;
    start = props.start;
    const packedEvents = populateEvents(props.events, width, props.start);
    let initPosition =
      _.min(_.map(packedEvents, 'top')) -
      calendarHeight / (props.end - props.start);
    initPosition = initPosition < 0 ? 0 : initPosition;
    this.state = {
      _scrollY: initPosition,
      isScoll:true,
      packedEvents,
      stylists: [],
      blankEvents:[
        {
          start: '2020-10-11 00:00:00',
          end: '2020-10-11 01:00:00',
          title: 'Engg Expo 2019',
          summary: 'Expoo Vanue not confirm',
        },
       
        
        {
          start: '2020-10-11 23:00:00',
          end: '2020-10-11 24:00:00',
          title: 'Engg Expo 2019',
          summary: 'Expoo Vanue not confirm',
        },
      ],
   
    };
  }

  componentWillReceiveProps(nextProps) {

    calendarHeight = (nextProps.end - nextProps.start) * 100;
   // console.log("calendarHeight", calendarHeight);
    const packedEvents = populateEvents(nextProps.events, width, nextProps.start);
    let initPosition =
    _.min(_.map(packedEvents, 'top')) -
    calendarHeight / (nextProps.end - nextProps.start);
  initPosition = initPosition < 0 ? 0 : initPosition;


    const width = (nextProps.width - LEFT_MARGIN) / nextProps.stylists.length;
    itemWidth = width;

    this.setState({
      _scrollY: initPosition,
      stylists: nextProps.stylists,
      packedEvents: packedEvents,
    });

  // if(this.state.packedEvents ?.length>0&&this.state.isScoll&&this.props.isScrolltoCurrentTime){
  //   this.scrollToFirst();
  // }
    
  }

  componentDidMount() {
     this.scrollToFirst();
  }

  scrollToFirst() {
    setTimeout(() => {
      if (this.state && this.state._scrollY && this._scrollView) {
        this._scrollView.scrollTo({
          x: 0,
          y: this.state._scrollY,
          animated: true,
          isScoll:false
        });
      }
    }, 1);
  }

  _renderRedLine() {
    const offset = 100;
    const { format24h } = this.props;
    const { width, styles } = this.props;
    const timeNowHour = moment().hour();
    const timeNowMin = moment().minutes();


this.setState({
  _scrollY:(offset * (timeNowHour - this.props.start) +
  (offset * timeNowMin) / 60)-150
},()=>{
 // this.scrollToFirst();
})
    

    return (
     <View
        key={`timeNow`}
        style={[
          styles.lineNow,
          {
            marginLeft:3,
            height:2,
            top:
              offset * (timeNowHour - this.props.start) +
              (offset * timeNowMin) / 60,
            width: width - 10,
          },
        ]}
      />

     
    );
  }

  _renderCurrentTimeLabels() {
    const offset = 100;
    const { format24h } = this.props;
    const { width, styles } = this.props;
    const timeNowHour = moment().hour();
    const timeNowMin = moment().minutes();


    let timeText;
    let ampmText;
     if (timeNowHour < 12) {
      timeText = !format24h ? `${timeNowHour}` : timeNowHour;
      ampmText='AM';
      
    } else if (timeNowHour === 12) {
      timeText = !format24h ? `${timeNowHour}` : timeNowHour;
      ampmText='PM';
    } else if (timeNowHour === 24) {
      timeText = !format24h ? `12` : 0;
      ampmText='AM';
    } else {
      timeText = !format24h ? `${timeNowHour - 12}` : timeNowHour;
      ampmText='PM';
    }
    return (
     
        

<View
        key={`timeNow`}
        style={[
        
          {
            borderColor:'red',
            borderRadius:10,
            marginLeft:2,
            borderWidth:1,
            alignItems:'center',
   
            top:
              (offset * (timeNowHour - this.props.start) +
              (offset * timeNowMin) / 60)-8,
            width:  49,
          },
        ]}
      >
<Text
          key={`timeLabel`}
          style={{ 
          
            color: 'red',
            fontSize: 9,}}
        >
          {timeText+":"+timeNowMin+" "+ampmText}
        </Text>
      </View>
    );
  }

  _renderLines() {
    const { format24h, start, end } = this.props;
    const offset = calendarHeight / (end - start);

    return range(start, end + 1).map((i, index) => {
      let timeText;
      if (i === start) {
        timeText = ``;
      } else if (i < 12) {
        timeText = !format24h ? `${i} AM` : i;
      } else if (i === 12) {
        timeText = !format24h ? `${i} PM` : i;
      } else if (i === 24) {
        timeText = !format24h ? `12 AM` : 0;
      } else {
        timeText = !format24h ? `${i - 12} PM` : i;
      }
      const { width, styles } = this.props;
      return [
        <Text
          key={`timeLabel${i}`}
          style={[styles.timeLabel, { top: offset * index - 6 }]}
        >
          {timeText}
        </Text>,
        i === start ? null : (
          <View
            key={`line${i}`}
            style={[styles.line, { top: offset * index, width: width - 20 }]}
          />
        ),
        <View
          key={`lineHalf${i}`}
          style={[
            styles.line,
            { top: offset * (index + 0.5), width: width - 20 },
          ]}
        />,
      ];
    });
  }

  _renderTimeLabels() {
    const { styles, start, end } = this.props;
    const offset = calendarHeight / (end - start);
    return range(start, end).map((item, i) => {
      return (
        <View key={`line${i}`} style={[styles.line, { top: offset * i }]} />
      );
    });
  }

  _onEventTapped(event) {
    this.props.eventTapped(event);
  }
  _onEmptyEventTapped(event) {
    this.props.emptyEventTapped(event);
  }

  //100/2=50/evenn,

  _getEvents(stylistsID) {
    const { styles } = this.props;
    const { packedEvents, stylists } = this.state;
   
    var list = packedEvents.filter((item) => {
      return stylistsID == item.resourceId
    })
      .map((item) => { return item });
    let stylistEvents = populateEvents(list, itemWidth, this.props.start);

    //     var list = packedEvents
    //   .map((item) => { return item });
    // let stylistEvents = populateEvents(list, itemWidth, this.props.start);

    let events = stylistEvents.map((event, i) => {
      const style = {
        left: event.left,
        height: event.height,
        width: event.width,
        //width: ((width-60)/stylists.length)/2-15,
        top: event.top,
      };


    
      const eventColor = {
       // backgroundColor: event ?.extendedProps ?.book ?.status==3?bookStatusColors.ShowColorCompleted:event ?.extendedProps ?.book ?.status==1?bookStatusColors.ShowColorInProgress:event ?.extendedProps ?.book ?.status==2?bookStatusColors.ShowColorDropped:bookStatusColors.ShowColorUpcoming,
     
       backgroundColor:event.backgroundColor,
      };

      // Fixing the number of lines for the event title makes this calculation easier.
      // However it would make sense to overflow the title to a new line if needed
      const numberOfLines = Math.floor(event.height / TEXT_LINE_HEIGHT);
      const formatTime = this.props.format24h ? 'HH:mm' : 'hh:mm A';
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() =>
            this._onEventTapped(event)
          }
          key={i} style={[styles.event, style,  eventColor]}
        >
          {this.props.renderEvent ? (
            this.props.renderEvent(event)
          ) : (
              <View>
                <Text numberOfLines={1} style={[styles.eventTitle,{color:"white"}]}>
                  {event.title || 'Event'}
                </Text>
                {numberOfLines > 1 ? (
                  <Text
                    numberOfLines={numberOfLines - 1}
                    style={[styles.eventSummary,{color:"white"}]}
                  >
                    {event.summary || ' '}
                  </Text>
                ) : null}
                {numberOfLines > 2 ? (
                  <Text style={[styles.eventTimes,{color:"white"}]} numberOfLines={1}>
                    {moment(event.start).format(formatTime)} -{' '}
                    {moment(event.end).format(formatTime)}
                  </Text>
                ) : null}
              </View>
            )}
        </TouchableOpacity>
      );

    });

    return events;
  }
  _renderEvents() {
    const { styles } = this.props;
    const { packedEvents, stylists } = this.state;
    // let events = packedEvents.map((event, i) => {
    //   const style = {
    //     left:event.left,
    //     height: event.height,
    //     width: event.width,
    //     //width: ((width-60)/stylists.length)/2-15,
    //     top: event.top,
    //   };

    //   const eventColor = {
    //     backgroundColor: event.color,
    //   };

    //   // Fixing the number of lines for the event title makes this calculation easier.
    //   // However it would make sense to overflow the title to a new line if needed
    //   const numberOfLines = Math.floor(event.height / TEXT_LINE_HEIGHT);
    //   const formatTime = this.props.format24h ? 'HH:mm' : 'hh:mm A';
    //   return (
    //     <TouchableOpacity
    //       activeOpacity={0.5}
    //       onPress={() =>
    //         this._onEventTapped(this.props.events[event.index])
    //       }
    //       key={i} style={[styles.event, style, event.color && eventColor]}
    //     >
    //       {this.props.renderEvent ? (
    //         this.props.renderEvent(event)
    //       ) : (
    //           <View>
    //             <Text numberOfLines={1} style={styles.eventTitle}>
    //               {event.title || 'Event'}
    //             </Text>
    //             {numberOfLines > 1 ? (
    //               <Text
    //                 numberOfLines={numberOfLines - 1}
    //                 style={[styles.eventSummary]}
    //               >
    //                 {event.summary || ' '}
    //               </Text>
    //             ) : null}
    //             {numberOfLines > 2 ? (
    //               <Text style={styles.eventTimes} numberOfLines={1}>
    //                 {moment(event.start).format(formatTime)} -{' '}
    //                 {moment(event.end).format(formatTime)}
    //               </Text>
    //             ) : null}
    //           </View>
    //         )}
    //     </TouchableOpacity>
    //   );
    // });

    return (
      <View style={{ flexDirection: 'row',}}>

        {stylists.map((item, i) => (

          <View style={{flex: 1, marginLeft: i == 0 ? LEFT_MARGIN : 0 }}>{this._getEvents(item.id)}</View>
        ))}


      </View>
    );
  }
  _renderVerticalLines() {
    const { styles } = this.props;
    const { stylists } = this.state;
   

    return (
      <View style={{ flexDirection: 'row',}}>

        {stylists.map((item, i) => (

          <View style={{
           flex: 1, marginLeft: i == 0 ? LEFT_MARGIN : 0 ,}}>

<View style={{width:1,
 backgroundColor:'transparent',
 height:height*4,
       
 borderRightColor:"#70757A",borderRightWidth:.4,}}></View>

           </View>
        ))}


      </View>
    );
  }
  _getBlankEvents(stylistsID,stylists_name) {

  

    const { styles } = this.props;
    const { packedEvents, stylists } = this.state;
      let list_blank = this.state.blankEvents.map((elem) => {
        return {
          start:moment(elem.start).format('YYYY-MM-DD HH:mm:ss'),
          end:moment(elem.end).format('YYYY-MM-DD HH:mm:ss'),
          title: elem.title,
          summary: '',
          stylists_id: stylistsID,
          stylists_name: stylists_name,
        }
      })


    let stylistEvents = populateEvents(list_blank, itemWidth, this.props.start);

    let events = stylistEvents.map((event, i) => {
      const style = {
        left: event.left,
        height: event.height,
        width: event.width,
        //width: ((width-60)/stylists.length)/2-15,
        top: event.top,
      };

      const eventColor = {
        backgroundColor: 'transparent',
      };

      // Fixing the number of lines for the event title makes this calculation easier.
      // However it would make sense to overflow the title to a new line if needed
      const numberOfLines = Math.floor(event.height / TEXT_LINE_HEIGHT);
      const formatTime = this.props.format24h ? 'HH:mm' : 'hh:mm A';
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() =>
            this._onEmptyEventTapped(stylistEvents[event.index])
          }
          key={i} style={[styles.blank_event, style,  eventColor]}
        >
          {this.props.renderEvent ? (
            this.props.renderEvent(event)
          ) : (
              <View>
                <Text numberOfLines={1} style={[styles.eventTitle]}>
                  {""}
                </Text>
                {numberOfLines > 1 ? (
                  <Text
                    numberOfLines={numberOfLines - 1}
                    style={[styles.eventSummary]}
                  >
                    { ' '}
                  </Text>
                ) : null}
                {numberOfLines > 2 ? (
                  <Text style={[styles.eventTimes]} numberOfLines={1}>
                  
                  </Text>
                ) : null}
              </View>
            )}
        </TouchableOpacity>
      );

    });

   

    return events;
  }
  _renderBlankEvents() {
    const { styles } = this.props;
    const { packedEvents, stylists } = this.state;
    

    return (
      <View style={{ flexDirection: 'row' }}>

        {stylists.map((item, i) => (

          <View style={{ flex: 1, marginLeft: i == 0 ? LEFT_MARGIN : 0 }}>{this._getBlankEvents(item.id,item.title)}</View>
        ))}


      </View>
    );
  }
  render() {
    const { styles } = this.props;
    return (
      <ScrollView
        ref={ref => (this._scrollView = ref)}
        contentContainerStyle={[
          styles.contentStyle,
          { width: this.props.width,height:calendarHeight+50 },
        ]}
      >
       {/* {this._renderBlankEvents()} */}
    
        {this._renderLines()}
        {this._renderRedLine()}
        {this._renderCurrentTimeLabels()}
        {this._renderEvents()}
        {this._renderVerticalLines()}
      
      
        
      </ScrollView>
    );
  }
}
