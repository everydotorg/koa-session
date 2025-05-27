import { Session } from './session.js';
import type { SessionOptions } from './index.js';
export declare class ContextSession {
    ctx: any;
    app: any;
    opts: SessionOptions;
    store: SessionOptions['store'];
    session: Session | false;
    externalKey?: string;
    prevHash?: number;
    /**
     * context session constructor
     */
    constructor(ctx: any, opts: SessionOptions);
    /**
     * modify cookie options based on request's domain
     */
    modifyOptsForRequest(options: SessionOptions): {
        key: string;
        autoCommit: boolean;
        overwrite: boolean;
        httpOnly: boolean;
        signed: boolean;
        rolling: boolean;
        renew: boolean;
        encode: (args_0: any, ...args: unknown[]) => string;
        decode: (args_0: string, ...args: unknown[]) => any;
        maxAge?: number | "session" | undefined;
        externalKey?: {
            set: (args_0: any, args_1: string, ...args: unknown[]) => void;
            get: (args_0: any, ...args: unknown[]) => string;
        } | undefined;
        valid?: ((args_0: any, args_1: any, ...args: unknown[]) => any) | undefined;
        secure?: boolean | undefined;
        sameSite?: string | undefined;
        store?: {
            set: (args_0: string, args_1: any, args_2: number, args_3: {
                rolling: boolean;
                changed: boolean;
                ctx?: any;
            }, ...args: unknown[]) => Promise<void>;
            get: (args_0: string, args_1: number, args_2: {
                rolling: boolean;
                ctx?: any;
            }, ...args: unknown[]) => Promise<any>;
            destroy: (args_0: string, args_1: {
                ctx?: any;
            }, ...args: unknown[]) => Promise<void>;
        } | undefined;
        ContextStore?: any;
        genid?: ((args_0: any, ...args: unknown[]) => string) | undefined;
        prefix?: string | undefined;
        beforeSave?: ((args_0: any, args_1: any, ...args: unknown[]) => void) | undefined;
        domain?: string | ((args_0: any, args_1: any, ...args: unknown[]) => string) | undefined;
    };
    /**
     * internal logic of `ctx.session`
     * @return {Session} session object
     */
    get(): Session | null;
    /**
     * internal logic of `ctx.session=`
     * @param {Object} val session object
     */
    set(val: Record<string, unknown> | null): void;
    /**
     * init session from external store
     * will be called in the front of session middleware
     *
     * @public
     */
    initFromExternal(): Promise<void>;
    /**
     * init session from cookie
     * @private
     */
    initFromCookie(): void;
    /**
     * verify session(expired or custom verification)
     * @param {Object} sessionData session data
     * @param {Object} [key] session externalKey(optional)
     * @private
     */
    protected valid(sessionData: Record<string, unknown>, key?: string): boolean;
    /**
     * @param {String} event event name
     * @param {Object} data event data
     * @private
     */
    emit(event: string, data: unknown): void;
    /**
     * create a new session and attach to ctx.sess
     *
     * @param {Object} [sessionData] session data
     * @param {String} [externalKey] session external key
     */
    protected create(sessionData?: Record<string, unknown>, externalKey?: string): void;
    /**
     * Commit the session changes or removal.
     */
    commit({ save, regenerate }?: {
        save?: boolean | undefined;
        regenerate?: boolean | undefined;
    }): Promise<void>;
    _shouldSaveSession(): "" | "changed" | "rolling" | "renew";
    /**
     * remove session
     * @private
     */
    remove(): Promise<void>;
    /**
     * save session
     * @private
     */
    save(changed: boolean): Promise<void>;
}
