"use strict";

const config = require("config");
const should = require("should");
const mongoose = require("mongoose");
const oauth2utils = require("../index.js");

let testingUser;
let testingClient;

describe("Testing oauth2-utils", function () {

  before(function (done) {

    mongoose.connection.once("open", function () {
      console.log("Database connection initialized");

      mongoose.connection.db.dropDatabase(function (err, result) {
        console.log("Database cleaned");
        done(err);
      });
    });

    mongoose.connection.once("error", function () {
      console.error("Unable to connect to the database");
    });

    mongoose.connect(`mongodb://${config.get("test.dbConfig.host")}:${config.get("test.dbConfig.port")}/${config.get("test.dbConfig.dbName")}`);

  });

  describe("Testing ErrorManager", function () {


    it("Should return a class", function (done) {
      const errorManager = oauth2utils.ErrorManager;

      errorManager.should.not.be.null();
      errorManager.should.be.type("function");
      done();
    });

    it("invalidRequestError() should return an invalidRequest error", function (done) {

      const invalidRequest = oauth2utils.ErrorManager.invalidRequestError();

      invalidRequest.should.be.instanceOf(Error);

      invalidRequest.should.have.property("httpStatus");
      invalidRequest.httpStatus.should.be.a.Number();
      invalidRequest.httpStatus.should.be.exactly(400);

      invalidRequest.should.have.property("errorCode");
      invalidRequest.errorCode.should.be.a.Number();
      invalidRequest.errorCode.should.be.exactly(1);

      invalidRequest.should.have.property("message");
      invalidRequest.message.should.be.a.String();
      invalidRequest.message.should.be.exactly("Invalid request");

      done();
    });

    it("internalServerError() should return an internal server error", function (done) {

      const internalError = oauth2utils.ErrorManager.internalServerError();

      internalError.should.be.instanceOf(Error);

      internalError.should.have.property("httpStatus");
      internalError.httpStatus.should.be.a.Number();
      internalError.httpStatus.should.be.exactly(500);

      internalError.should.have.property("errorCode");
      internalError.errorCode.should.be.a.Number();
      internalError.errorCode.should.be.exactly(1);

      internalError.should.have.property("message");
      internalError.message.should.be.a.String();
      internalError.message.should.be.exactly("Internal server error");

      done();
    });


  });

  describe("Testing ModelManager", function () {

    const modelManager = oauth2utils.ModelManager;

    it("Should return a class", function (done) {

      modelManager.should.not.be.null();
      modelManager.should.be.type("function");

      done();
    });

    it("getClientModel() should return a client Model", function (done) {

      const clientModel = modelManager.getClientModel();

      clientModel.should.not.be.null();
      clientModel.should.have.property("createClient");
      clientModel.should.have.property("findByClientId");
      clientModel.should.have.property("findByClientIdAndSecret");
      clientModel.should.have.property("deleteClientById");

      clientModel.createClient("hello", 3, function (err, newClient) {
        if (err) {
          done(err);
        }
        else {
          testingClient = newClient;

          clientModel.createClient("toto", 3, function (err, client) {
            if (err) {
              done (err);
            }
            else {

              clientModel.findByClientId(client.id, function (err, fclient) {
                if (err) {
                  done (err);
                }
                else {
                  fclient.id.should.be.exactly(client.id);

                  clientModel.findByClientIdAndSecret(client.id, client.secret, function (err, ffclient) {
                    if (err) {
                      done(err);
                    }
                    else {

                      ffclient.id.should.be.exactly(client.id);

                      clientModel.deleteClientById(client.id, function (err) {

                        clientModel.findByClientId(client.id, function (err, fffclient) {
                          if (err) {
                            done(err);
                          }
                          else {

                            should(fffclient).not.be.ok();
                            done();
                          }
                        });
                      });

                    }
                  });

                }
              });

            }
          });
        }
      });

    });

    it("getUserModel() should return a user Model", function (done) {

      const userModel = modelManager.getUserModel();

      userModel.should.not.be.null();
      userModel.should.have.property("createUser");
      userModel.should.have.property("findUserByEmail");
      userModel.should.have.property("findUserByPublicId");
      userModel.should.have.property("deleteByEmail");

      userModel.createUser("test", "password", function (err, newUser ) {
        if (err) {
          done(err);
        }
        else {

          testingUser = newUser;

          userModel.createUser("totot", "titi", function (err, user ) {
            if (err) {
              done(err);
            }
            else {

              user.should.not.be.null();
              user.email.should.be.exactly("totot");

              user.verifyPassword("password", function (err, result) {
                if (err) {
                  done(err);
                }
                else {

                  result.should.be.exactly(false);

                  user.verifyPassword("titi", function (err, result) {
                    if (err) {
                      done(err);
                    }
                    else {

                      result.should.be.exactly(true);

                      userModel.findUserByEmail(user.email, function (err, fuser) {
                        if (err) {
                          done(err);
                        }
                        else {

                          fuser.should.not.be.null();
                          fuser.publicId.should.be.exactly(user.publicId);

                          userModel.findUserByPublicId(user.publicId, function (err, ffuser) {
                            if (err) {
                              done(err);
                            }
                            else {

                              ffuser.should.not.be.null();
                              ffuser.publicId.should.be.exactly(user.publicId);

                              userModel.deleteByEmail(user.email, function (err) {
                                if (err) {
                                  done (err);
                                }
                                else {

                                  userModel.findUserByEmail(user.email, function (err, fffuser) {
                                    if (err) {
                                      done(err);
                                    }
                                    else {

                                      should(fffuser).not.be.ok();
                                      done();
                                    }
                                  });
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    });

    it("getAccessTokenModel() should return a accessToken Model", function (done) {

      const accessTokenModel = modelManager.getAccessTokenModel();

      accessTokenModel.should.not.be.null();
      accessTokenModel.should.have.property("createToken");
      accessTokenModel.should.have.property("getToken");
      accessTokenModel.should.have.property("disableOldToken");

      accessTokenModel.createToken("code", testingUser._id, testingClient._id, ["lol"], function (err, token1) {
        if (err) {
          done(err);
        }
        else {

          should(token1).be.ok();

          accessTokenModel.createToken("code", testingUser._id, testingClient._id, ["lol"], function (err, token2) {
            if (err) {
              done(err);
            }
            else {

              should(token2).be.ok();

              accessTokenModel.getToken(token2.token, function (err, ftoken) {
                if (err) {
                  done(er);
                }
                else {

                  should(ftoken).be.ok();
                  ftoken.token.should.be.exactly(token2.token);
                  ftoken.usable.should.be.exactly(true);

                  token2.condemn(function (err) {
                    if (err) {
                      done(err);
                    }
                    else {

                      accessTokenModel.getToken(token2.token, function (err, ftoken) {
                        if (err) {
                          done(err);
                        }
                        else {

                          should(ftoken).not.be.ok();

                          accessTokenModel.disableOldToken(testingClient._id, testingUser._id, function (err) {
                            if (err) {
                              done(err);
                            }
                            else {

                              accessTokenModel.getToken(token1.token, function (err, fftoken) {
                                if (err) {
                                  done(err);
                                }
                                else {

                                  should(fftoken).not.be.ok();
                                  done();
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    });

    it("getRefreshTokenModel() should return a refreshToken Model", function (done) {

      const refreshTokenModel = modelManager.getRefreshTokenModel();

      refreshTokenModel.should.not.be.null();
      refreshTokenModel.should.have.property("createToken");
      refreshTokenModel.should.have.property("getToken");
      refreshTokenModel.should.have.property("disableOldToken");

      refreshTokenModel.createToken("code", testingUser._id, testingClient._id, ["lol"], function (err, token1) {
        if (err) {
          done(err);
        }
        else {

          should(token1).be.ok();

          refreshTokenModel.createToken("code", testingUser._id, testingClient._id, ["lol"], function (err, token2) {
            if (err) {
              done(err);
            }
            else {

              should(token2).be.ok();

              refreshTokenModel.getToken(token1.token, testingClient._id, ["lol"], function (err, ftoken) {
                if (err) {
                  done(err);
                }
                else {

                  should(ftoken).be.ok();
                  ftoken.token.should.be.exactly(token1.token);

                  token1.condemn(function (err) {
                    if (err) {
                      done(err);
                    }
                    else {

                      token1.usable.should.be.exactly(false);
                      refreshTokenModel.getToken(token1.token, testingClient._id, ["lol"], function (err, ftoken) {

                        should(ftoken).not.be.ok();

                        refreshTokenModel.disableOldToken(testingClient._id, testingUser._id, function (err) {
                          if (err) {
                            done(err);
                          }
                          else {

                            refreshTokenModel.getToken(token2.token, testingClient._id, ["lol"], function (err, ftoken) {
                              if (err) {
                                done(err);
                              }
                              else {

                                should(ftoken).not.be.ok();
                                done();
                              }
                            });
                          }
                        });
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });


    });

    it("getAuthCodeModel() should return an authCode Model", function (done) {

      const authCodeModel = modelManager.getAuthCodeModel();

      authCodeModel.should.not.be.null();
      authCodeModel.should.have.property("createCode");
      authCodeModel.should.have.property("getCode");

      authCodeModel.createCode(testingUser._id, testingClient._id, "toto", ["lol"], function (err, code1) {
        if (err) {
          done(err);
        }
        else {

          should(code1).be.ok();
          code1.usable.should.be.exactly(true);

          authCodeModel.createCode(testingUser._id, testingClient._id, "toto", ["lol"], function (err, code2) {
            if (err) {
              done(err);
            }
            else {

              should(code2).be.ok();
              code2.usable.should.be.exactly(true);

              authCodeModel.getCode(code1.code, testingClient._id, function (err, fcode) {
                if (err) {
                  done(err);
                }
                else {

                  should(fcode).be.ok();
                  fcode.code.should.be.exactly(code1.code);

                  code1.useCode(function (err) {
                    if (err) {
                      done(err);
                    }
                    else {

                      authCodeModel.getCode(code1.code, testingClient._id, function (err, fcode) {
                        if (err) {
                          done(err);
                        }
                        else {

                          should(fcode).not.be.ok();

                          code2.condemn(function (err) {
                            if (err) {
                              done(err);
                            }
                            else {

                              authCodeModel.getCode(code2.code, testingClient._id, function (err, fcode) {
                                if (err) {
                                  done(err);
                                }
                                else {

                                  should(fcode).not.be.ok();
                                  done();
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    });

    it("getUserDecisionModel() should return a, userDecision Model", function (done) {

      const userDecisionModel = modelManager.getUserDecisionModel();

      userDecisionModel.should.not.be.null();
      userDecisionModel.should.have.property("createUserDecision");
      userDecisionModel.should.have.property("findUserDecision");
      userDecisionModel.should.have.property("disableOldDecision");

      userDecisionModel.createUserDecision(testingUser._id, testingClient._id, true, ["lol"], function (err, userDecision) {
        if (err) {
          done(err);
        }
        else {

          should(userDecision).be.ok();

          userDecisionModel.findUserDecision(testingUser._id, testingClient._id, ["lol"], function (err, fuserDecision) {
            if (err) {
              done(err);
            }
            else {

              should(fuserDecision).be.ok();

              userDecisionModel.disableOldDecision(testingUser._id, testingClient._id, function (err) {
                if (err) {
                  done(err);
                }
                else {

                  userDecisionModel.findUserDecision(testingUser._id, testingClient._id, ["lol"], function (err, fuserDecision) {
                    if (err) {
                      done(err);
                    }
                    else {

                      should(fuserDecision).not.be.ok();
                      done();
                    }
                  });
                }
              });
            }
          });
        }
      });
    });

  });

  describe("Test Utils", function () {

    const utils = oauth2utils.Utils;

    it("Should return a class", function (done) {

      utils.should.not.be.null();
      utils.should.be.type("function");

      done();

    });

    it("uidGen() should return a valid uid", function (done) {

      utils.uidGen.should.not.be.null();
      utils.uidGen.should.be.type("function");

      const res = utils.uidGen(5);

      res.should.be.String();
      res.length.should.be.exactly(5);

      done();
    });
  });


  after(function (done) {
    mongoose.connection.db.dropDatabase(function () {
      console.log("Database cleaned");

      mongoose.disconnect(function () {
        done();
      });
    });
  });
});