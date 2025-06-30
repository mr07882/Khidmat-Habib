import React from 'react';
import {
  View,
  Image,
  TouchableHighlight,
  Text,
  Dimensions,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';
import {images as img} from '../Config/AppConfigData';

const width = Math.round(Dimensions.get('window').width) - 35;
const images = [
  {
    database: true,
    ImageUrl: img.mainPageBanner,
    timeStamp: '58694a0f-3da1-471f-bd96-145571e29d72',
    link: '',
  },
];

class MainPageBanners extends React.Component {
  scrollRef = React.createRef();

  constructor() {
    super();
    this.state = {
      mainPageBanners: [
        {
          database: true,
          ImageUrl: img.mainPageBanner,
          timeStamp: '58694a0f-3da1-471f-bd96-145571e29d72',
          link: '',
        },
      ],
      selectedIndex: 0,
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.setState(
        prev => ({
          selectedIndex:
            prev.selectedIndex === this.state.mainPageBanners.length - 1
              ? 0
              : prev.selectedIndex + 1,
        }),
        () => {
          this.scrollRef.current.scrollTo({
            animated: true,
            y: 0,
            x: width * this.state.selectedIndex,
          });
        },
      );
    }, 4000);
  }

  static getDerivedStateFromProps(nextProps) {
    let banners = nextProps.mainPageBanners;
    if (banners) {
      let array = [];
      for (var key in banners) {
        array.push(banners[key]);
      }
      let sorted = array.sort(function (a, b) {
        return a.timeStamp - b.timeStamp;
      });
      var display = sorted.reverse();
      return {mainPageBanners: display};
    } else {
      return {mainPageBanners: images};
    }
  }

  openLink(isLink, isHtml, label, link, html, id) {
    if (isLink || isHtml) {
      this.props.navigation.navigate(`${'WebViewByLink'}`, {
        WebViewLink: link,
        html,
        label,
        isLink,
        isHtml,
      });
    } else {
      id && this.props.navigation.navigate('NewsEvents', {id});
    }
  }

  setSelectedIndex = ({nativeEvent}) => {
    const selectedIndex = Math.floor(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
    );
    this.setState({selectedIndex});
  };

  render() {
    const {mainPageBanners} = this.state;
    return (
      <View style={styles.container}>
        <ScrollView
          onMomentumScrollEnd={this.setSelectedIndex}
          ref={this.scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.scroll}>
          {mainPageBanners.map((item, index) => (
            <TouchableHighlight
              key={item.timeStamp}
              onPress={() => {
                this.openLink(
                  item.isLink,
                  item.isHtml,
                  item.label,
                  item.link,
                  item.html,
                  item.id,
                );
              }}>
              <Image
                style={styles.image}
                source={!!item.database ? item.ImageUrl : {uri: item.ImageUrl}}
              />
            </TouchableHighlight>
          ))}
        </ScrollView>
        {mainPageBanners.length > 1 && (
          <View style={styles.pagination}>
            {mainPageBanners.map((i, k) => (
              <Text
                key={k}
                style={
                  k === this.state.selectedIndex
                    ? styles.pagingActiveText
                    : styles.pagingText
                }>
                ⬤
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  }
}

const height = 180;

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    alignItems: 'center',
    height,
    width,
    marginHorizontal: 2.5,
    shadowRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    elevation: 7,
    borderRadius: 10,
  },
  scroll: {width, height, borderRadius: 10},
  pagingText: {fontSize: width / 35, color: '#888'},
  pagingActiveText: {fontSize: width / 35, color: '#fff'},
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
  image: {
    width,
    height,
    resizeMode: 'stretch',
    borderRadius: 10,
  },
});

const mapStateToProps = state => {
  return {
    mainPageBanners: state.reducer.mainPageBanners,
  };
};
export default connect(mapStateToProps)(MainPageBanners);
