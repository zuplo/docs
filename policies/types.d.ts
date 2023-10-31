// This is a simplified version of these interfaces just for code completion
// in policy examples

declare module "@zuplo/runtime" {
  export interface IncomingRequestProperties {
    /**
     * ASN of the incoming request, for example, 395747.
     */
    readonly asn: number | undefined;

    /**
     * The organization which owns the ASN of the incoming request,
     * for example, Google Cloud.
     */
    readonly asOrganization: string | undefined;

    /**
     * City of the incoming request, for example, "Austin".
     */
    readonly city: string | undefined;

    /**
     * Continent of the incoming request, for example, "NA".
     */
    readonly continent: string | undefined;
    /**
     * The two-letter country code in the request.
     * @see {@link https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2|ISO 3166-1 alpha-2}
     */
    readonly country: string | undefined;

    /**
     * Latitude of the incoming request, for example, "30.27130".
     */
    readonly latitude: string | undefined;

    /**
     * Longitude of the incoming request, for example, "-97.74260".
     */
    readonly longitude: string | undefined;

    /**
     * The three-letter IATA airport code of the data center that the request hit,
     * for example, "DFW".
     * @see {@link https://en.wikipedia.org/wiki/IATA_airport_code|IATA airport code}
     */
    readonly colo: string | undefined;

    /**
     * Postal code of the incoming request, for example, "78701".
     */
    readonly postalCode: string | undefined;

    /**
     * Metro code (DMA) of the incoming request, for example, "635".
     */
    readonly metroCode: string | undefined;

    /**
     * If known, the ISO 3166-2 name for the first level region associated with
     * the IP address of the incoming request, for example, "Texas".
     * @see {@link https://en.wikipedia.org/wiki/ISO_3166-2|ISO 3166-2}
     */
    readonly region: string | undefined;

    /**
     * If known, the ISO 3166-2 code for the first-level region associated with
     * the IP address of the incoming request, for example, "TX".
     * @see {@link https://en.wikipedia.org/wiki/ISO_3166-2|ISO 3166-2}
     */
    readonly regionCode: string | undefined;

    /**
     * Timezone of the incoming request, for example, "America/Chicago".
     */
    readonly timezone: string | undefined;
  }
  /**
   * @beta
   */
  export interface OnResponseSendingFinalHook {
    (
      response: Response,
      latestRequest: ZuploRequest,
      context: ZuploContext
    ): Promise<void>;
  }
  /**
   * @beta
   */
  export interface Logger {
    debug(...messages: unknown[]): void;
    info(...messages: unknown[]): void;
    log(...messages: unknown[]): void; // maps to info, for similarity to console.log
    warn(...messages: unknown[]): void;
    error(...messages: unknown[]): void;
  }

  export interface RequestUser<TUserData = any> {
    sub: string;
    data: TUserData;
  }
  export class ZuploRequest<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TUserData = any,
    TParams extends Record<string, string> = Record<string, string>,
    TQuery extends Record<string, string> = Record<string, string>
  > extends Request {
    get query(): Readonly<TQuery>;
    get params(): Readonly<TParams>;
    user?: RequestUser<TUserData>;
  }
  export interface ZuploContext {
    readonly requestId: Readonly<string>;
    readonly log: Readonly<Logger>;
    readonly route: Readonly<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly custom: Record<string, any>;
    readonly incomingRequestProperties: IncomingRequestProperties;
    readonly invokeInboundPolicy: (
      policyName: string,
      request: ZuploRequest
    ) => Promise<Response | ZuploRequest>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly waitUntil: (promise: Promise<any>) => void;
    /**
     * Fires immediately after the response is sent. Response cannot be modified.
     */
    readonly addResponseSendingFinalHook: (
      hook: OnResponseSendingFinalHook
    ) => void;
  }
}
