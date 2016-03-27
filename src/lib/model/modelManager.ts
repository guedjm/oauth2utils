"use strict";

import { IClientDocumentModel, clientDocumentModel} from "./client";
import { IUserDocumentModel, userDocumentModel} from "./user";
import { IAccessTokenDocumentModel, accessTokenModel} from "./accessToken";
import { IRefreshTokenDocumentModel, refreshTokenModel} from "./refreshToken";
import { IAuthCodeDocumentModel, authCodeModel} from "./authCode";
import { IUserDecisionDocumentModel, userDecisionModel} from "./userDecision";

export class ModelManager {

  public static getClientModel(): IClientDocumentModel {
    return <IClientDocumentModel>clientDocumentModel;
  }

  public static getUserModel(): IUserDocumentModel {
    return <IUserDocumentModel>userDocumentModel;
  }

  public static getAccessTokenModel(): IAccessTokenDocumentModel {
    return <IAccessTokenDocumentModel>accessTokenModel;
  }

  public static getRefreshTokenModel(): IRefreshTokenDocumentModel {
    return <IRefreshTokenDocumentModel>refreshTokenModel;
  }

  public static getAuthCodeModel(): IAuthCodeDocumentModel {
    return <IAuthCodeDocumentModel>authCodeModel;
  }

  public static getUserDecisionModel(): IUserDecisionDocumentModel {
    return <IUserDecisionDocumentModel>userDecisionModel;
  }
}
