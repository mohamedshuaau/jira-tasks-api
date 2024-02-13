import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class AuthenticateService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly loggerService: LoggerService,
  ) {}

  /**
   * Constructs a redirect url to get an auth code and redirects the user to the url
   *
   * @param response
   */
  authenticate(response: Response) {
    const url = this.constructAuthCodeUrl();
    response.redirect(url);
  }

  /**
   * Uses an auth code to get an access token
   * Once the user authorizes their access to Jira, we will call this callback to get the access token
   * State is just a random number generated in the initial call. Will just leave it for now
   *
   * @param state
   * @param code
   */
  async handleCallback(state: string, code: string) {
    // get all variables from env
    const accessTokenRequestUrl = this.configService.get(
      'ACCESS_TOKEN_REQUEST_URL',
    );
    const clientId = this.configService.get('CLIENT_ID');
    const clientSecret = this.configService.get('CLIENT_SECRET');
    const callbackUrl = this.configService.get('CALLBACK_URL');

    if (!code) {
      return;
    }

    try {
      // send the auth code along with other details to get an access token
      const authenticate = await this.httpService.axiosRef.post(
        accessTokenRequestUrl,
        {
          grant_type: 'authorization_code',
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
          redirect_uri: callbackUrl,
        },
      );
    } catch (error) {
      this.loggerService.error(
        'Something went wrong while trying to get the access token',
        error,
      );
    }
  }

  /**
   * Reauthenticate using the refresh token
   *
   * @param refresh_token
   */
  async authenticateWithRefreshToken(refresh_token: string) {
    // get all variables from env
    const accessTokenRequestUrl = this.configService.get(
      'ACCESS_TOKEN_REQUEST_URL',
    );
    const clientId = this.configService.get('CLIENT_ID');
    const clientSecret = this.configService.get('CLIENT_SECRET');

    try {
      // send the auth code along with other details to get an access token
      const refresh = await this.httpService.axiosRef.post(
        accessTokenRequestUrl,
        {
          grant_type: 'refresh_token',
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refresh_token,
        },
      );
    } catch (error) {
      this.loggerService.error(
        'Something went wrong while trying to get the access token',
        error,
      );
    }
  }

  /**
   * Constructs an url to get the auth code
   * Replaces the specified values with the env string provided
   */
  constructAuthCodeUrl() {
    // get all variables from env
    let authCodeUrl = this.configService.get('AUTH_CODE_URL');
    const clientId = this.configService.get('CLIENT_ID');
    const scopes = this.configService.get('SCOPES');
    const callbackUrl = this.configService.get('CALLBACK_URL');

    // ready the replacement keys and its values
    const replacements = {
      '${CLIENT_ID}': clientId,
      '${SCOPES}': scopes,
      '${CALLBACK_URL}': callbackUrl,
      '${STATE}': crypto.randomUUID(),
    };

    // for each of the replacements, find the corresponding key and its values and replace them
    for (const placeholder in replacements) {
      if (replacements.hasOwnProperty(placeholder)) {
        authCodeUrl = authCodeUrl.replace(
          placeholder,
          replacements[placeholder],
        );
      }
    }

    return authCodeUrl;
  }
}
