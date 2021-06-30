
import React from "react"
import EventPage from '../components/EventPage'
import Layout from "../components/Layout"
import { graphql } from 'gatsby'
import { Router } from '@reach/router'
import StoryblokService from '../utils/storyblok-service'
import SEO from "../components/HeadSeo"

import "../assets/scss/blog.scss"
import "../assets/scss/main.scss"

export default class extends React.Component {
  constructor(props) {
    super(props);
    let content =  []

    props.data.stories.edges.forEach((story) => {
      const event = JSON.parse(story.node.content);
      let uid = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 50);

      if(story.node.full_slug.includes('events/')) {
        let s_date = new Date(event.start_date.split(" ")[0]);
        let today = new Date();
        //s_date.setDate(s_date.getDate());
        s_date = new Date(s_date.toLocaleString(undefined));
//var countDownDate = new Date(dateTime).getTime();
        if (s_date > today) {
          story.node['uid'] = uid;
          console.log("TESTETESTST");
          console.log(s_date);
          let n_date = new Date(s_date.toLocaleString);
          console.log(n_date);
          story.node['countDownDate'] = s_date.getTime();

          content.push(story.node);
        }
      }
    });

    this.state = {
      events: { content }
    };
  }

  async countDown(countDownDate, elementId) {
    // Set the date we're counting down to
    //var countDownDate = new Date(dateTime).getTime();

    // Update the count down every 1 second
    var x = setInterval(function() {

      // Get today's date and time
      var now_ish = new Date();
      var now = now_ish.getTime() +  now_ish.getTimezoneOffset() * 60000;
      now  = new Date(now_ish.toLocaleString(undefined));

      // Find the distance between now and the count down date
      var distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"
      document.getElementById(elementId).innerHTML = days + "d " + hours + "h "
      + minutes + "m " + seconds + "s ";

      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(x);
        document.getElementById(elementId).innerHTML = "COMPLETED";
      }
    }, 250);
  }

  async componentDidMount() {
    console.log("DID MOUNT");

    //console.log(this.state.events.content);
    this.state.events.content.map((event, index) => {
      console.log(event);
      this.countDown(event.countDownDate, event.uid);
    });
  }

  render() {
    console.log(this.state);
    return (
      <Layout location={this.props.location}>
        <SEO title="Events" description="Sommelier upcoming events."/>
        <Router>
          {<EventPage blok={this.state} title='Upcoming Events' history={false} path='/events' />}
        </Router>
      </Layout>
    )
  }
}

export const query = graphql`
{
  stories: allStoryblokEntry {
    edges {
      node {
        id
        name
        created_at
        published_at
        uuid
        slug
        full_slug
        content
        is_startpage
        parent_id
        group_id
      }
    }
  }
}
`
