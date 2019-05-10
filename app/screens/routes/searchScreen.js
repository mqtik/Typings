import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TextInput, ActivityIndicator, View, Button, Alert, TouchableOpacity, Image, ImageBackground, ScrollView, StatusBar, SafeAreaView } from 'react-native';
import Icon from 'react-native-fa-icons';
import Icono from 'react-native-vector-icons/Ionicons';
import PouchDB from 'pouchdb-react-native'
import APIAuth from 'pouchdb-authentication'
import APIFind from 'pouchdb-find'
import Toast, {DURATION} from 'react-native-easy-toast'
import { API_URL, PORT_API_DIRECT, PORT_API, DB_BOOKS, INDEX_NAME, LOCAL_DB_NAME, API_STATIC, SETTINGS_LOCAL_DB_NAME } from 'react-native-dotenv'
import LinearGradient from 'react-native-linear-gradient';
import styles from '../../styles/searchScreen.style';
import { getLang, Languages } from '../../static/languages';
import { StretchyHeader } from '../../../libraries/stretchy';
import _ from 'lodash';
import uuid from 'react-native-uuid';
import { FlatGrid } from 'react-native-super-grid';
import {
    CachedImage,
    ImageCacheProvider
} from 'react-native-cached-image';
import * as Progress from 'react-native-progress';
PouchDB.plugin(APIAuth);
PouchDB.plugin(APIFind);
let API = PouchDB(API_URL+':'+PORT_API_DIRECT, {skip_setup: true});
let APIBooks = PouchDB(API_URL+':'+PORT_API_DIRECT+'/'+DB_BOOKS, {skip_setup: true});
let APILocal = PouchDB(LOCAL_DB_NAME, {auto_compaction: true});

export default class SearchScreen extends Component<Props>{
    constructor (props) {
        super(props);
        //let searchText = this.props.navigation.getParam('searchText', false);
        
        this.state = {
            isLoading: true,
            smartLoad: this.props.tags,
            allBooks: this.props.allBooks,
            searched: null
        };
    }

    componentDidMount() {
        this.setState({isLoading: false});
        
       
        let x = 0;
        let hashTags = [];
        for(let key in this.state.smartLoad){
            let docresult = _.filter(this.state.allBooks, function(doc){
              if(doc.tags){
                return doc.tags.toLowerCase().includes(key.trim().toLowerCase()) == true;
              }
             });
            hashTags.push({[key.trim()]:docresult});
        }
        let tags = hashTags.map((key, i) => {
                          for(let k in key){
                            return k.replace(/^\s+|\s+$/g,'')
                          }
                        }).slice().sort(function(a,b){return a > b}).reduce(function(a,b){if (a.slice(-1)[0] !== b) a.push(b);return a;},[]);

        
         this.setState({tags: tags});
        }


   searchBooksSpecificProperties = (properties, books, filter) => {
      var searchSpecificProperties = _.isArray(properties);
      var result;
        if (typeof filter=== "undefined" ||  filter.length==0) {
            result = books;
        } else {
          result = _.filter(books, function (c) {
            var cProperties = searchSpecificProperties ? properties : _.keys(c);
            return _.find(cProperties, function(property) {
              if (c[property]) {
                return _.includes(_.lowerCase(c[property]),_.lowerCase(filter));
              }          
            });         
         });
       }
       return result;
     }
     _searchBooks = () => {
       if(this.props.onSearch != null) {
         let searched = this.searchBooksSpecificProperties(['title'], this.state.allBooks, this.props.onSearch);
         this.setState({ searched: searched})
       }
     }
     _searchByTag = (tag) => {

         this.props.navigation.setParams({ SearchInput: tag });
         let searched = this.searchBooksSpecificProperties(['tags'], this.state.allBooks, tag);
         this.setState({ searched: searched})
         this.refs.searchScrollView.scrollTo({x: 0, y: 0, animated: true});
     }
     _goBook = (doc) => {
       let data = [];
       data.data = doc;
       this.props.navigation.setParams({ dataDoc: doc });
       this.props.navigation.navigate('Details',{
                                        dataDoc: data
                                      });
     }
     _renderSearch = () => {
       
       if(this.state.searched != null){
              return (
               <View>

                <Text style={{color: '#fff', marginLeft: 20, marginTop: 20, marginBottom: 10, fontSize: 20, fontWeight: 'bold'}}>
                {Languages.Results[getLang()]}
                </Text>

                <TouchableOpacity style={{backgroundColor: '#444', position: 'absolute', right: 15, top: 15, fontSize: 20, height: 30, width: 30, borderRadius: 30}}>
                  <Text style={{color: '#999', fontSize: 14, fontWeight: 'bold', marginTop: 7, marginLeft: this.state.searched.length > 9 ? 7 : 10}}>
                    {this.state.searched.length}
                  </Text>
                </TouchableOpacity>

                {this.state.searched.length == 0 && <Text style={{color: '#555', marginLeft: 20, marginTop: 20, fontSize: 16, textAlign: 'center'}}>
                  {Languages.thereAreNoResults[getLang()]}
                </Text>} 

                 <FlatGrid
                   itemDimension={130}
                   items={this.state.searched}
                   renderItem={({ item, index }) => (
                     <TouchableOpacity
                      activeOpacity={1}
                      style={styles.slideInnerContainer}
                      onPress={() => this._goBook(item)}
                      >
                      <View style={styles.shadow} />
                       <View style={styles.imageContainer}>
                           
                         <Image style={styles.image} source={{uri: API_STATIC+'/covers/'+item.cover}}/>
                         <View style={styles.radiusMask} />
                         <LinearGradient
                                    colors={['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.6)', 'rgb(0, 0, 0)']}
                                    style={styles.contentContainer}
                                  />
                                 
                                  {item.percentage != null && 
                                       
                                          <Progress.Circle style={{position: 'absolute', top: 10, right: 10, flex: 1, justifyContent: 'center', alignItems: 'center'}} color={'#55c583'} progress={item.percentage} size={50} />
                                }
                         <View style={styles.textContainer}>
                             
                               <Text
                                    style={styles.title}
                                    numberOfLines={2}
                                  >
                                      { item.title.toUpperCase() }
                                  </Text>
                                  
                              </View>

                        </View>
                        
                    </TouchableOpacity>

                     )}
                 />
                 </View>
                 )
            }
     }

    _renderTags = () => {
         var colors = ['#F44336', '#673AB7', '#009588', '#8BC34A', '#AA01FF', '#D80173', '#FF9802', '#334190', '#01BCD4', '#795548', '#9E9E9E', '#FFC108', '#3F687C', '#023851', '#D33C0D', '#D1DB6D', '#9C26B0', '#FFEB3B', '#2096F3'];
        return (
          <View> 
          <Text style={{color: '#fff', marginLeft: 20, marginTop: 20, fontSize: 20, fontWeight: 'bold'}}>
            {Languages.findMoreByTag[getLang()]}
          </Text> 
          <FlatGrid
            itemDimension={130}
            items={this.state.tags}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => this._searchByTag(item)} style={{height: 80, backgroundColor: colors[index], borderRadius: 8, alignItems: 'center'}}>
              <Text style={{color: '#fff', textAlign: 'center', marginLeft: 0, marginTop: 30, fontSize: 20, fontWeight: 'bold', textShadowColor: 'rgba(0, 0, 0, 0.75)',
  textShadowOffset: {width: -1, height: 1},
  textShadowRadius: 4}}>{item}</Text>
              </TouchableOpacity>
              )}
          />
          </View>
          )
        /*return (
          <View>
          <Grid size={12}>
                <Row>
          {hashTags.map((key, i) => {
                          for(let k in key){
                            return (
                              <Col key={uuid.v1()} size={4} style={styles.tagGender, {backgroundColor: 'red', height: 100, borderRadius: 8, margin: 10, alignItems:'center', fontSize: 18}}>
                                <Text style={{color: '#fff', fontSize: 22, marginTop: 35, fontWeight: 'bold'}}>{k}</Text>
                              </Col>
                            )
                          }
                        })}
            </Row>
          </Grid>
          </View>
          )*/
    }
    render(){
        if (this.state.isLoading == true) {
      return (
        <ActivityIndicator
            style={styles.indicator}
            color="#000"
            size="large"
          />
        )
    } else {
        return(
            <ScrollView style={{flex: 1}} ref="searchScrollView">
            
              {this._renderSearch()}

              {this._renderTags()}
            </ScrollView>

        );
    }
    }
}