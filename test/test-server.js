/* This file will test the GET, POST, PUT and DELETE endpoints
 */

const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, closeServer, runServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

// testing GET
describe('Normal Case blog api interactions', function() {

  // before and after functions make sure the server is ready
  // for the tests, and stops after tests are done
  before(function() {
    return runServer();
  });

  after(function(){
    return closeServer();
  });

  // test strategy:
  //  1. make a get request to '/blog-posts'
  //  2. inspect that the response is in json, isn't empty,
  //  elemnts have required keys and json enough elements
  it('should GET all blog posts', function() {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        console.log("response:\n" + (res)); // DEBUG
        const expectedKeys = ['title', 'content', 'author', 'publishDate'];
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');

        // we created 2 dummy blog posts
        res.body.length.should.be.at.least(1);
        // each item should have expected keys
        res.body.forEach(function(blogpost) {
          blogpost.should.be.a('object');
          blogpost.should.include.keys(expectedKeys);

        });
      });
  });

  // below from sollution set

  // post a normal case blog post
  it('should POST a single blog post', function() {
    const newPost = {
      title: 'Lorem ip some',
      content: 'foo foo foo foo',
      author: 'Emma Goldman',
      publishDate: "0111"
    };
    const expectedKeys = ['id'].concat(Object.keys(newPost));

    return chai.request(app)
      .post('/blog-posts')
      .send(newPost)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.all.keys(expectedKeys);
        res.body.title.should.equal(newPost.title);
        res.body.content.should.equal(newPost.content);
        res.body.author.should.equal(newPost.author)
      }).catch(err => console.log(err));
  });

  it('should error if POST missing expected values', function() {
    const badRequestData = {};
    return chai.request(app)
      .post('/blog-posts')
      .send(badRequestData)
      .catch(function(res) {
        res.should.have.status(400);
      });
  });

  it('should update blog posts on PUT', function() {

    return chai.request(app)
      // first have to get
      .get('/blog-posts')
      .then(function( res) {
        const updatedPost = Object.assign(res.body[0], {
          title: 'connect the dots',
          content: 'la la la la la'
        });
        return chai.request(app)
          .put(`/blog-posts/${res.body[0].id}`)
          .send(updatedPost)
          .then(function(res) {
            res.should.have.status(204);
          });
      });
  });

  it('should delete posts on DELETE', function() {
    return chai.request(app)
      // first have to get
      .get('/blog-posts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blog-posts/${res.body[0].id}`)
          .then(function(res) {
            res.should.have.status(204);
          });
      });
  });


});
