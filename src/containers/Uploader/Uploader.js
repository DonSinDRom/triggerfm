import React, { Component } from 'react';
const request = require('superagent');
import styles from './Uploader.scss';

export default class Uploader extends Component {

  onChange(ev) {
    console.log('onChange', ev);
    // const req = request.post('http://main.trigger.fm/upload/server/php/');
    const files = ev.target.files;

    request.post('http://main.trigger.fm/upload/server/php/')
      .attach(files[0].name, files[0])
//      .set('Content-Type', 'audio/mpeg')
      .set('Content-Disposition', 'form-data')
      .send({ filename: 'One More Try - Steins;Gate AMV.mp3', name: 'files[]' })
      .end(data => { console.log(data); });
//    req.send({ filename: 'One More Try - Steins;Gate AMV.mp3', name: 'files[]' });
//    req.attach(files[0].name, files[0]);
//    req.set('Content-Type', 'audio/mpeg');
//    req.set('Content-Disposition', 'form-data');
//    req.end(data => { console.log(data); });
  }

  render() {
    return (
      <div className={styles.uploader}>
        <input type="file" placeholder="Тащи сюда свою музыку" multiple onChange={(ev) => this.onChange(ev) } />
      </div>
    );
  }
}
