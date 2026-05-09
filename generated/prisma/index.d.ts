
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Estate
 * 
 */
export type Estate = $Result.DefaultSelection<Prisma.$EstatePayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Resident
 * 
 */
export type Resident = $Result.DefaultSelection<Prisma.$ResidentPayload>
/**
 * Model Visitor
 * 
 */
export type Visitor = $Result.DefaultSelection<Prisma.$VisitorPayload>
/**
 * Model GateLog
 * 
 */
export type GateLog = $Result.DefaultSelection<Prisma.$GateLogPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  ADMIN: 'ADMIN',
  RESIDENT: 'RESIDENT',
  GUARD: 'GUARD'
};

export type Role = (typeof Role)[keyof typeof Role]


export const VisitorStatus: {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  DENIED: 'DENIED',
  CHECKED_IN: 'CHECKED_IN',
  CHECKED_OUT: 'CHECKED_OUT'
};

export type VisitorStatus = (typeof VisitorStatus)[keyof typeof VisitorStatus]


export const ResidentStatus: {
  PENDING: 'PENDING',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  ACTIVE: 'ACTIVE'
};

export type ResidentStatus = (typeof ResidentStatus)[keyof typeof ResidentStatus]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type VisitorStatus = $Enums.VisitorStatus

export const VisitorStatus: typeof $Enums.VisitorStatus

export type ResidentStatus = $Enums.ResidentStatus

export const ResidentStatus: typeof $Enums.ResidentStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Estates
 * const estates = await prisma.estate.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Estates
   * const estates = await prisma.estate.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.estate`: Exposes CRUD operations for the **Estate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Estates
    * const estates = await prisma.estate.findMany()
    * ```
    */
  get estate(): Prisma.EstateDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.resident`: Exposes CRUD operations for the **Resident** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Residents
    * const residents = await prisma.resident.findMany()
    * ```
    */
  get resident(): Prisma.ResidentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.visitor`: Exposes CRUD operations for the **Visitor** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Visitors
    * const visitors = await prisma.visitor.findMany()
    * ```
    */
  get visitor(): Prisma.VisitorDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.gateLog`: Exposes CRUD operations for the **GateLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GateLogs
    * const gateLogs = await prisma.gateLog.findMany()
    * ```
    */
  get gateLog(): Prisma.GateLogDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Estate: 'Estate',
    User: 'User',
    Resident: 'Resident',
    Visitor: 'Visitor',
    GateLog: 'GateLog'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "estate" | "user" | "resident" | "visitor" | "gateLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Estate: {
        payload: Prisma.$EstatePayload<ExtArgs>
        fields: Prisma.EstateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EstateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EstateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstatePayload>
          }
          findFirst: {
            args: Prisma.EstateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EstateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstatePayload>
          }
          findMany: {
            args: Prisma.EstateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstatePayload>[]
          }
          create: {
            args: Prisma.EstateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstatePayload>
          }
          createMany: {
            args: Prisma.EstateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EstateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstatePayload>[]
          }
          delete: {
            args: Prisma.EstateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstatePayload>
          }
          update: {
            args: Prisma.EstateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstatePayload>
          }
          deleteMany: {
            args: Prisma.EstateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EstateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EstateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstatePayload>[]
          }
          upsert: {
            args: Prisma.EstateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EstatePayload>
          }
          aggregate: {
            args: Prisma.EstateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEstate>
          }
          groupBy: {
            args: Prisma.EstateGroupByArgs<ExtArgs>
            result: $Utils.Optional<EstateGroupByOutputType>[]
          }
          count: {
            args: Prisma.EstateCountArgs<ExtArgs>
            result: $Utils.Optional<EstateCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Resident: {
        payload: Prisma.$ResidentPayload<ExtArgs>
        fields: Prisma.ResidentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ResidentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResidentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ResidentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResidentPayload>
          }
          findFirst: {
            args: Prisma.ResidentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResidentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ResidentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResidentPayload>
          }
          findMany: {
            args: Prisma.ResidentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResidentPayload>[]
          }
          create: {
            args: Prisma.ResidentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResidentPayload>
          }
          createMany: {
            args: Prisma.ResidentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ResidentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResidentPayload>[]
          }
          delete: {
            args: Prisma.ResidentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResidentPayload>
          }
          update: {
            args: Prisma.ResidentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResidentPayload>
          }
          deleteMany: {
            args: Prisma.ResidentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ResidentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ResidentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResidentPayload>[]
          }
          upsert: {
            args: Prisma.ResidentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResidentPayload>
          }
          aggregate: {
            args: Prisma.ResidentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateResident>
          }
          groupBy: {
            args: Prisma.ResidentGroupByArgs<ExtArgs>
            result: $Utils.Optional<ResidentGroupByOutputType>[]
          }
          count: {
            args: Prisma.ResidentCountArgs<ExtArgs>
            result: $Utils.Optional<ResidentCountAggregateOutputType> | number
          }
        }
      }
      Visitor: {
        payload: Prisma.$VisitorPayload<ExtArgs>
        fields: Prisma.VisitorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VisitorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VisitorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitorPayload>
          }
          findFirst: {
            args: Prisma.VisitorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VisitorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitorPayload>
          }
          findMany: {
            args: Prisma.VisitorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitorPayload>[]
          }
          create: {
            args: Prisma.VisitorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitorPayload>
          }
          createMany: {
            args: Prisma.VisitorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VisitorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitorPayload>[]
          }
          delete: {
            args: Prisma.VisitorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitorPayload>
          }
          update: {
            args: Prisma.VisitorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitorPayload>
          }
          deleteMany: {
            args: Prisma.VisitorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VisitorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VisitorUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitorPayload>[]
          }
          upsert: {
            args: Prisma.VisitorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitorPayload>
          }
          aggregate: {
            args: Prisma.VisitorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVisitor>
          }
          groupBy: {
            args: Prisma.VisitorGroupByArgs<ExtArgs>
            result: $Utils.Optional<VisitorGroupByOutputType>[]
          }
          count: {
            args: Prisma.VisitorCountArgs<ExtArgs>
            result: $Utils.Optional<VisitorCountAggregateOutputType> | number
          }
        }
      }
      GateLog: {
        payload: Prisma.$GateLogPayload<ExtArgs>
        fields: Prisma.GateLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GateLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GateLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GateLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GateLogPayload>
          }
          findFirst: {
            args: Prisma.GateLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GateLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GateLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GateLogPayload>
          }
          findMany: {
            args: Prisma.GateLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GateLogPayload>[]
          }
          create: {
            args: Prisma.GateLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GateLogPayload>
          }
          createMany: {
            args: Prisma.GateLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GateLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GateLogPayload>[]
          }
          delete: {
            args: Prisma.GateLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GateLogPayload>
          }
          update: {
            args: Prisma.GateLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GateLogPayload>
          }
          deleteMany: {
            args: Prisma.GateLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GateLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GateLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GateLogPayload>[]
          }
          upsert: {
            args: Prisma.GateLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GateLogPayload>
          }
          aggregate: {
            args: Prisma.GateLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGateLog>
          }
          groupBy: {
            args: Prisma.GateLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<GateLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.GateLogCountArgs<ExtArgs>
            result: $Utils.Optional<GateLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    estate?: EstateOmit
    user?: UserOmit
    resident?: ResidentOmit
    visitor?: VisitorOmit
    gateLog?: GateLogOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type EstateCountOutputType
   */

  export type EstateCountOutputType = {
    residents: number
    users: number
    visitors: number
  }

  export type EstateCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    residents?: boolean | EstateCountOutputTypeCountResidentsArgs
    users?: boolean | EstateCountOutputTypeCountUsersArgs
    visitors?: boolean | EstateCountOutputTypeCountVisitorsArgs
  }

  // Custom InputTypes
  /**
   * EstateCountOutputType without action
   */
  export type EstateCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EstateCountOutputType
     */
    select?: EstateCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EstateCountOutputType without action
   */
  export type EstateCountOutputTypeCountResidentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ResidentWhereInput
  }

  /**
   * EstateCountOutputType without action
   */
  export type EstateCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * EstateCountOutputType without action
   */
  export type EstateCountOutputTypeCountVisitorsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VisitorWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    gateLogs: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gateLogs?: boolean | UserCountOutputTypeCountGateLogsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountGateLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GateLogWhereInput
  }


  /**
   * Count Type ResidentCountOutputType
   */

  export type ResidentCountOutputType = {
    visitors: number
  }

  export type ResidentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    visitors?: boolean | ResidentCountOutputTypeCountVisitorsArgs
  }

  // Custom InputTypes
  /**
   * ResidentCountOutputType without action
   */
  export type ResidentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResidentCountOutputType
     */
    select?: ResidentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ResidentCountOutputType without action
   */
  export type ResidentCountOutputTypeCountVisitorsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VisitorWhereInput
  }


  /**
   * Count Type VisitorCountOutputType
   */

  export type VisitorCountOutputType = {
    gateLogs: number
  }

  export type VisitorCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gateLogs?: boolean | VisitorCountOutputTypeCountGateLogsArgs
  }

  // Custom InputTypes
  /**
   * VisitorCountOutputType without action
   */
  export type VisitorCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitorCountOutputType
     */
    select?: VisitorCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * VisitorCountOutputType without action
   */
  export type VisitorCountOutputTypeCountGateLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GateLogWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Estate
   */

  export type AggregateEstate = {
    _count: EstateCountAggregateOutputType | null
    _avg: EstateAvgAggregateOutputType | null
    _sum: EstateSumAggregateOutputType | null
    _min: EstateMinAggregateOutputType | null
    _max: EstateMaxAggregateOutputType | null
  }

  export type EstateAvgAggregateOutputType = {
    totalHouses: number | null
  }

  export type EstateSumAggregateOutputType = {
    totalHouses: number | null
  }

  export type EstateMinAggregateOutputType = {
    id: string | null
    name: string | null
    address: string | null
    totalHouses: number | null
    createdAt: Date | null
  }

  export type EstateMaxAggregateOutputType = {
    id: string | null
    name: string | null
    address: string | null
    totalHouses: number | null
    createdAt: Date | null
  }

  export type EstateCountAggregateOutputType = {
    id: number
    name: number
    address: number
    totalHouses: number
    createdAt: number
    settings: number
    _all: number
  }


  export type EstateAvgAggregateInputType = {
    totalHouses?: true
  }

  export type EstateSumAggregateInputType = {
    totalHouses?: true
  }

  export type EstateMinAggregateInputType = {
    id?: true
    name?: true
    address?: true
    totalHouses?: true
    createdAt?: true
  }

  export type EstateMaxAggregateInputType = {
    id?: true
    name?: true
    address?: true
    totalHouses?: true
    createdAt?: true
  }

  export type EstateCountAggregateInputType = {
    id?: true
    name?: true
    address?: true
    totalHouses?: true
    createdAt?: true
    settings?: true
    _all?: true
  }

  export type EstateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Estate to aggregate.
     */
    where?: EstateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Estates to fetch.
     */
    orderBy?: EstateOrderByWithRelationInput | EstateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EstateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Estates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Estates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Estates
    **/
    _count?: true | EstateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EstateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EstateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EstateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EstateMaxAggregateInputType
  }

  export type GetEstateAggregateType<T extends EstateAggregateArgs> = {
        [P in keyof T & keyof AggregateEstate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEstate[P]>
      : GetScalarType<T[P], AggregateEstate[P]>
  }




  export type EstateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EstateWhereInput
    orderBy?: EstateOrderByWithAggregationInput | EstateOrderByWithAggregationInput[]
    by: EstateScalarFieldEnum[] | EstateScalarFieldEnum
    having?: EstateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EstateCountAggregateInputType | true
    _avg?: EstateAvgAggregateInputType
    _sum?: EstateSumAggregateInputType
    _min?: EstateMinAggregateInputType
    _max?: EstateMaxAggregateInputType
  }

  export type EstateGroupByOutputType = {
    id: string
    name: string
    address: string
    totalHouses: number
    createdAt: Date
    settings: JsonValue | null
    _count: EstateCountAggregateOutputType | null
    _avg: EstateAvgAggregateOutputType | null
    _sum: EstateSumAggregateOutputType | null
    _min: EstateMinAggregateOutputType | null
    _max: EstateMaxAggregateOutputType | null
  }

  type GetEstateGroupByPayload<T extends EstateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EstateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EstateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EstateGroupByOutputType[P]>
            : GetScalarType<T[P], EstateGroupByOutputType[P]>
        }
      >
    >


  export type EstateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    address?: boolean
    totalHouses?: boolean
    createdAt?: boolean
    settings?: boolean
    residents?: boolean | Estate$residentsArgs<ExtArgs>
    users?: boolean | Estate$usersArgs<ExtArgs>
    visitors?: boolean | Estate$visitorsArgs<ExtArgs>
    _count?: boolean | EstateCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["estate"]>

  export type EstateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    address?: boolean
    totalHouses?: boolean
    createdAt?: boolean
    settings?: boolean
  }, ExtArgs["result"]["estate"]>

  export type EstateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    address?: boolean
    totalHouses?: boolean
    createdAt?: boolean
    settings?: boolean
  }, ExtArgs["result"]["estate"]>

  export type EstateSelectScalar = {
    id?: boolean
    name?: boolean
    address?: boolean
    totalHouses?: boolean
    createdAt?: boolean
    settings?: boolean
  }

  export type EstateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "address" | "totalHouses" | "createdAt" | "settings", ExtArgs["result"]["estate"]>
  export type EstateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    residents?: boolean | Estate$residentsArgs<ExtArgs>
    users?: boolean | Estate$usersArgs<ExtArgs>
    visitors?: boolean | Estate$visitorsArgs<ExtArgs>
    _count?: boolean | EstateCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EstateIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type EstateIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $EstatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Estate"
    objects: {
      residents: Prisma.$ResidentPayload<ExtArgs>[]
      users: Prisma.$UserPayload<ExtArgs>[]
      visitors: Prisma.$VisitorPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      address: string
      totalHouses: number
      createdAt: Date
      settings: Prisma.JsonValue | null
    }, ExtArgs["result"]["estate"]>
    composites: {}
  }

  type EstateGetPayload<S extends boolean | null | undefined | EstateDefaultArgs> = $Result.GetResult<Prisma.$EstatePayload, S>

  type EstateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EstateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EstateCountAggregateInputType | true
    }

  export interface EstateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Estate'], meta: { name: 'Estate' } }
    /**
     * Find zero or one Estate that matches the filter.
     * @param {EstateFindUniqueArgs} args - Arguments to find a Estate
     * @example
     * // Get one Estate
     * const estate = await prisma.estate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EstateFindUniqueArgs>(args: SelectSubset<T, EstateFindUniqueArgs<ExtArgs>>): Prisma__EstateClient<$Result.GetResult<Prisma.$EstatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Estate that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EstateFindUniqueOrThrowArgs} args - Arguments to find a Estate
     * @example
     * // Get one Estate
     * const estate = await prisma.estate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EstateFindUniqueOrThrowArgs>(args: SelectSubset<T, EstateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EstateClient<$Result.GetResult<Prisma.$EstatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Estate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EstateFindFirstArgs} args - Arguments to find a Estate
     * @example
     * // Get one Estate
     * const estate = await prisma.estate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EstateFindFirstArgs>(args?: SelectSubset<T, EstateFindFirstArgs<ExtArgs>>): Prisma__EstateClient<$Result.GetResult<Prisma.$EstatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Estate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EstateFindFirstOrThrowArgs} args - Arguments to find a Estate
     * @example
     * // Get one Estate
     * const estate = await prisma.estate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EstateFindFirstOrThrowArgs>(args?: SelectSubset<T, EstateFindFirstOrThrowArgs<ExtArgs>>): Prisma__EstateClient<$Result.GetResult<Prisma.$EstatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Estates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EstateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Estates
     * const estates = await prisma.estate.findMany()
     * 
     * // Get first 10 Estates
     * const estates = await prisma.estate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const estateWithIdOnly = await prisma.estate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EstateFindManyArgs>(args?: SelectSubset<T, EstateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EstatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Estate.
     * @param {EstateCreateArgs} args - Arguments to create a Estate.
     * @example
     * // Create one Estate
     * const Estate = await prisma.estate.create({
     *   data: {
     *     // ... data to create a Estate
     *   }
     * })
     * 
     */
    create<T extends EstateCreateArgs>(args: SelectSubset<T, EstateCreateArgs<ExtArgs>>): Prisma__EstateClient<$Result.GetResult<Prisma.$EstatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Estates.
     * @param {EstateCreateManyArgs} args - Arguments to create many Estates.
     * @example
     * // Create many Estates
     * const estate = await prisma.estate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EstateCreateManyArgs>(args?: SelectSubset<T, EstateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Estates and returns the data saved in the database.
     * @param {EstateCreateManyAndReturnArgs} args - Arguments to create many Estates.
     * @example
     * // Create many Estates
     * const estate = await prisma.estate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Estates and only return the `id`
     * const estateWithIdOnly = await prisma.estate.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EstateCreateManyAndReturnArgs>(args?: SelectSubset<T, EstateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EstatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Estate.
     * @param {EstateDeleteArgs} args - Arguments to delete one Estate.
     * @example
     * // Delete one Estate
     * const Estate = await prisma.estate.delete({
     *   where: {
     *     // ... filter to delete one Estate
     *   }
     * })
     * 
     */
    delete<T extends EstateDeleteArgs>(args: SelectSubset<T, EstateDeleteArgs<ExtArgs>>): Prisma__EstateClient<$Result.GetResult<Prisma.$EstatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Estate.
     * @param {EstateUpdateArgs} args - Arguments to update one Estate.
     * @example
     * // Update one Estate
     * const estate = await prisma.estate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EstateUpdateArgs>(args: SelectSubset<T, EstateUpdateArgs<ExtArgs>>): Prisma__EstateClient<$Result.GetResult<Prisma.$EstatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Estates.
     * @param {EstateDeleteManyArgs} args - Arguments to filter Estates to delete.
     * @example
     * // Delete a few Estates
     * const { count } = await prisma.estate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EstateDeleteManyArgs>(args?: SelectSubset<T, EstateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Estates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EstateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Estates
     * const estate = await prisma.estate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EstateUpdateManyArgs>(args: SelectSubset<T, EstateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Estates and returns the data updated in the database.
     * @param {EstateUpdateManyAndReturnArgs} args - Arguments to update many Estates.
     * @example
     * // Update many Estates
     * const estate = await prisma.estate.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Estates and only return the `id`
     * const estateWithIdOnly = await prisma.estate.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EstateUpdateManyAndReturnArgs>(args: SelectSubset<T, EstateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EstatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Estate.
     * @param {EstateUpsertArgs} args - Arguments to update or create a Estate.
     * @example
     * // Update or create a Estate
     * const estate = await prisma.estate.upsert({
     *   create: {
     *     // ... data to create a Estate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Estate we want to update
     *   }
     * })
     */
    upsert<T extends EstateUpsertArgs>(args: SelectSubset<T, EstateUpsertArgs<ExtArgs>>): Prisma__EstateClient<$Result.GetResult<Prisma.$EstatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Estates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EstateCountArgs} args - Arguments to filter Estates to count.
     * @example
     * // Count the number of Estates
     * const count = await prisma.estate.count({
     *   where: {
     *     // ... the filter for the Estates we want to count
     *   }
     * })
    **/
    count<T extends EstateCountArgs>(
      args?: Subset<T, EstateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EstateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Estate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EstateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EstateAggregateArgs>(args: Subset<T, EstateAggregateArgs>): Prisma.PrismaPromise<GetEstateAggregateType<T>>

    /**
     * Group by Estate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EstateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EstateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EstateGroupByArgs['orderBy'] }
        : { orderBy?: EstateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EstateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEstateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Estate model
   */
  readonly fields: EstateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Estate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EstateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    residents<T extends Estate$residentsArgs<ExtArgs> = {}>(args?: Subset<T, Estate$residentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResidentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    users<T extends Estate$usersArgs<ExtArgs> = {}>(args?: Subset<T, Estate$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    visitors<T extends Estate$visitorsArgs<ExtArgs> = {}>(args?: Subset<T, Estate$visitorsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VisitorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Estate model
   */
  interface EstateFieldRefs {
    readonly id: FieldRef<"Estate", 'String'>
    readonly name: FieldRef<"Estate", 'String'>
    readonly address: FieldRef<"Estate", 'String'>
    readonly totalHouses: FieldRef<"Estate", 'Int'>
    readonly createdAt: FieldRef<"Estate", 'DateTime'>
    readonly settings: FieldRef<"Estate", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * Estate findUnique
   */
  export type EstateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Estate
     */
    select?: EstateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Estate
     */
    omit?: EstateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstateInclude<ExtArgs> | null
    /**
     * Filter, which Estate to fetch.
     */
    where: EstateWhereUniqueInput
  }

  /**
   * Estate findUniqueOrThrow
   */
  export type EstateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Estate
     */
    select?: EstateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Estate
     */
    omit?: EstateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstateInclude<ExtArgs> | null
    /**
     * Filter, which Estate to fetch.
     */
    where: EstateWhereUniqueInput
  }

  /**
   * Estate findFirst
   */
  export type EstateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Estate
     */
    select?: EstateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Estate
     */
    omit?: EstateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstateInclude<ExtArgs> | null
    /**
     * Filter, which Estate to fetch.
     */
    where?: EstateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Estates to fetch.
     */
    orderBy?: EstateOrderByWithRelationInput | EstateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Estates.
     */
    cursor?: EstateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Estates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Estates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Estates.
     */
    distinct?: EstateScalarFieldEnum | EstateScalarFieldEnum[]
  }

  /**
   * Estate findFirstOrThrow
   */
  export type EstateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Estate
     */
    select?: EstateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Estate
     */
    omit?: EstateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstateInclude<ExtArgs> | null
    /**
     * Filter, which Estate to fetch.
     */
    where?: EstateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Estates to fetch.
     */
    orderBy?: EstateOrderByWithRelationInput | EstateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Estates.
     */
    cursor?: EstateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Estates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Estates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Estates.
     */
    distinct?: EstateScalarFieldEnum | EstateScalarFieldEnum[]
  }

  /**
   * Estate findMany
   */
  export type EstateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Estate
     */
    select?: EstateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Estate
     */
    omit?: EstateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstateInclude<ExtArgs> | null
    /**
     * Filter, which Estates to fetch.
     */
    where?: EstateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Estates to fetch.
     */
    orderBy?: EstateOrderByWithRelationInput | EstateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Estates.
     */
    cursor?: EstateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Estates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Estates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Estates.
     */
    distinct?: EstateScalarFieldEnum | EstateScalarFieldEnum[]
  }

  /**
   * Estate create
   */
  export type EstateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Estate
     */
    select?: EstateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Estate
     */
    omit?: EstateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstateInclude<ExtArgs> | null
    /**
     * The data needed to create a Estate.
     */
    data: XOR<EstateCreateInput, EstateUncheckedCreateInput>
  }

  /**
   * Estate createMany
   */
  export type EstateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Estates.
     */
    data: EstateCreateManyInput | EstateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Estate createManyAndReturn
   */
  export type EstateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Estate
     */
    select?: EstateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Estate
     */
    omit?: EstateOmit<ExtArgs> | null
    /**
     * The data used to create many Estates.
     */
    data: EstateCreateManyInput | EstateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Estate update
   */
  export type EstateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Estate
     */
    select?: EstateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Estate
     */
    omit?: EstateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstateInclude<ExtArgs> | null
    /**
     * The data needed to update a Estate.
     */
    data: XOR<EstateUpdateInput, EstateUncheckedUpdateInput>
    /**
     * Choose, which Estate to update.
     */
    where: EstateWhereUniqueInput
  }

  /**
   * Estate updateMany
   */
  export type EstateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Estates.
     */
    data: XOR<EstateUpdateManyMutationInput, EstateUncheckedUpdateManyInput>
    /**
     * Filter which Estates to update
     */
    where?: EstateWhereInput
    /**
     * Limit how many Estates to update.
     */
    limit?: number
  }

  /**
   * Estate updateManyAndReturn
   */
  export type EstateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Estate
     */
    select?: EstateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Estate
     */
    omit?: EstateOmit<ExtArgs> | null
    /**
     * The data used to update Estates.
     */
    data: XOR<EstateUpdateManyMutationInput, EstateUncheckedUpdateManyInput>
    /**
     * Filter which Estates to update
     */
    where?: EstateWhereInput
    /**
     * Limit how many Estates to update.
     */
    limit?: number
  }

  /**
   * Estate upsert
   */
  export type EstateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Estate
     */
    select?: EstateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Estate
     */
    omit?: EstateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstateInclude<ExtArgs> | null
    /**
     * The filter to search for the Estate to update in case it exists.
     */
    where: EstateWhereUniqueInput
    /**
     * In case the Estate found by the `where` argument doesn't exist, create a new Estate with this data.
     */
    create: XOR<EstateCreateInput, EstateUncheckedCreateInput>
    /**
     * In case the Estate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EstateUpdateInput, EstateUncheckedUpdateInput>
  }

  /**
   * Estate delete
   */
  export type EstateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Estate
     */
    select?: EstateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Estate
     */
    omit?: EstateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstateInclude<ExtArgs> | null
    /**
     * Filter which Estate to delete.
     */
    where: EstateWhereUniqueInput
  }

  /**
   * Estate deleteMany
   */
  export type EstateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Estates to delete
     */
    where?: EstateWhereInput
    /**
     * Limit how many Estates to delete.
     */
    limit?: number
  }

  /**
   * Estate.residents
   */
  export type Estate$residentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resident
     */
    select?: ResidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resident
     */
    omit?: ResidentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResidentInclude<ExtArgs> | null
    where?: ResidentWhereInput
    orderBy?: ResidentOrderByWithRelationInput | ResidentOrderByWithRelationInput[]
    cursor?: ResidentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ResidentScalarFieldEnum | ResidentScalarFieldEnum[]
  }

  /**
   * Estate.users
   */
  export type Estate$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Estate.visitors
   */
  export type Estate$visitorsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Visitor
     */
    select?: VisitorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Visitor
     */
    omit?: VisitorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitorInclude<ExtArgs> | null
    where?: VisitorWhereInput
    orderBy?: VisitorOrderByWithRelationInput | VisitorOrderByWithRelationInput[]
    cursor?: VisitorWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VisitorScalarFieldEnum | VisitorScalarFieldEnum[]
  }

  /**
   * Estate without action
   */
  export type EstateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Estate
     */
    select?: EstateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Estate
     */
    omit?: EstateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EstateInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    role: $Enums.Role | null
    first_login: boolean | null
    createdAt: Date | null
    estateId: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    role: $Enums.Role | null
    first_login: boolean | null
    createdAt: Date | null
    estateId: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    password: number
    role: number
    first_login: number
    createdAt: number
    estateId: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    role?: true
    first_login?: true
    createdAt?: true
    estateId?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    role?: true
    first_login?: true
    createdAt?: true
    estateId?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    role?: true
    first_login?: true
    createdAt?: true
    estateId?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    password: string
    role: $Enums.Role
    first_login: boolean
    createdAt: Date
    estateId: string
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    first_login?: boolean
    createdAt?: boolean
    estateId?: boolean
    estate?: boolean | EstateDefaultArgs<ExtArgs>
    resident?: boolean | User$residentArgs<ExtArgs>
    gateLogs?: boolean | User$gateLogsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    first_login?: boolean
    createdAt?: boolean
    estateId?: boolean
    estate?: boolean | EstateDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    first_login?: boolean
    createdAt?: boolean
    estateId?: boolean
    estate?: boolean | EstateDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    first_login?: boolean
    createdAt?: boolean
    estateId?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "password" | "role" | "first_login" | "createdAt" | "estateId", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    estate?: boolean | EstateDefaultArgs<ExtArgs>
    resident?: boolean | User$residentArgs<ExtArgs>
    gateLogs?: boolean | User$gateLogsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    estate?: boolean | EstateDefaultArgs<ExtArgs>
  }
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    estate?: boolean | EstateDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      estate: Prisma.$EstatePayload<ExtArgs>
      resident: Prisma.$ResidentPayload<ExtArgs> | null
      gateLogs: Prisma.$GateLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      password: string
      role: $Enums.Role
      first_login: boolean
      createdAt: Date
      estateId: string
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    estate<T extends EstateDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EstateDefaultArgs<ExtArgs>>): Prisma__EstateClient<$Result.GetResult<Prisma.$EstatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    resident<T extends User$residentArgs<ExtArgs> = {}>(args?: Subset<T, User$residentArgs<ExtArgs>>): Prisma__ResidentClient<$Result.GetResult<Prisma.$ResidentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    gateLogs<T extends User$gateLogsArgs<ExtArgs> = {}>(args?: Subset<T, User$gateLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GateLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly first_login: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly estateId: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.resident
   */
  export type User$residentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resident
     */
    select?: ResidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resident
     */
    omit?: ResidentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResidentInclude<ExtArgs> | null
    where?: ResidentWhereInput
  }

  /**
   * User.gateLogs
   */
  export type User$gateLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GateLog
     */
    select?: GateLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GateLog
     */
    omit?: GateLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GateLogInclude<ExtArgs> | null
    where?: GateLogWhereInput
    orderBy?: GateLogOrderByWithRelationInput | GateLogOrderByWithRelationInput[]
    cursor?: GateLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GateLogScalarFieldEnum | GateLogScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Resident
   */

  export type AggregateResident = {
    _count: ResidentCountAggregateOutputType | null
    _min: ResidentMinAggregateOutputType | null
    _max: ResidentMaxAggregateOutputType | null
  }

  export type ResidentMinAggregateOutputType = {
    id: string | null
    first_name: string | null
    last_name: string | null
    email: string | null
    phone: string | null
    dob: string | null
    gender: string | null
    estateId: string | null
    userId: string | null
    status: $Enums.ResidentStatus | null
    house_no: string | null
    block: string | null
    home_address: string | null
    state_of_origin: string | null
    lga: string | null
    id_type: string | null
    id_no: string | null
    id_document_front: string | null
    id_document_back: string | null
    bvn: string | null
    alternate_phone: string | null
    next_of_kin_name: string | null
    next_of_kin_phone: string | null
    next_of_kin_email: string | null
    next_of_kin_relationship: string | null
    guarantor_name: string | null
    guarantor_occupation: string | null
    guarantor_work_address: string | null
    guarantor_id_no: string | null
    guarantor_id_relationship: string | null
    signed_guarantor_letter_upload: string | null
    vehicle_plate_no: string | null
    vehicle_make: string | null
    vehicle_color: string | null
    proof_of_address_upload: string | null
    passport: string | null
    tenancy_ownership_doc: string | null
    wallet_pin: string | null
    ndprConsentDataProcessing: boolean | null
    ndprConsentIdentity: boolean | null
    ndprConsentThirdParty: boolean | null
    ndprConsentGivenAt: Date | null
    approvedAt: Date | null
    rejectedAt: Date | null
    createdAt: Date | null
  }

  export type ResidentMaxAggregateOutputType = {
    id: string | null
    first_name: string | null
    last_name: string | null
    email: string | null
    phone: string | null
    dob: string | null
    gender: string | null
    estateId: string | null
    userId: string | null
    status: $Enums.ResidentStatus | null
    house_no: string | null
    block: string | null
    home_address: string | null
    state_of_origin: string | null
    lga: string | null
    id_type: string | null
    id_no: string | null
    id_document_front: string | null
    id_document_back: string | null
    bvn: string | null
    alternate_phone: string | null
    next_of_kin_name: string | null
    next_of_kin_phone: string | null
    next_of_kin_email: string | null
    next_of_kin_relationship: string | null
    guarantor_name: string | null
    guarantor_occupation: string | null
    guarantor_work_address: string | null
    guarantor_id_no: string | null
    guarantor_id_relationship: string | null
    signed_guarantor_letter_upload: string | null
    vehicle_plate_no: string | null
    vehicle_make: string | null
    vehicle_color: string | null
    proof_of_address_upload: string | null
    passport: string | null
    tenancy_ownership_doc: string | null
    wallet_pin: string | null
    ndprConsentDataProcessing: boolean | null
    ndprConsentIdentity: boolean | null
    ndprConsentThirdParty: boolean | null
    ndprConsentGivenAt: Date | null
    approvedAt: Date | null
    rejectedAt: Date | null
    createdAt: Date | null
  }

  export type ResidentCountAggregateOutputType = {
    id: number
    first_name: number
    last_name: number
    email: number
    phone: number
    dob: number
    gender: number
    estateId: number
    userId: number
    status: number
    house_no: number
    block: number
    home_address: number
    state_of_origin: number
    lga: number
    id_type: number
    id_no: number
    id_document_front: number
    id_document_back: number
    bvn: number
    alternate_phone: number
    next_of_kin_name: number
    next_of_kin_phone: number
    next_of_kin_email: number
    next_of_kin_relationship: number
    guarantor_name: number
    guarantor_occupation: number
    guarantor_work_address: number
    guarantor_id_no: number
    guarantor_id_relationship: number
    signed_guarantor_letter_upload: number
    vehicle_plate_no: number
    vehicle_make: number
    vehicle_color: number
    proof_of_address_upload: number
    passport: number
    tenancy_ownership_doc: number
    wallet_pin: number
    ndprConsentDataProcessing: number
    ndprConsentIdentity: number
    ndprConsentThirdParty: number
    ndprConsentGivenAt: number
    approvedAt: number
    rejectedAt: number
    createdAt: number
    _all: number
  }


  export type ResidentMinAggregateInputType = {
    id?: true
    first_name?: true
    last_name?: true
    email?: true
    phone?: true
    dob?: true
    gender?: true
    estateId?: true
    userId?: true
    status?: true
    house_no?: true
    block?: true
    home_address?: true
    state_of_origin?: true
    lga?: true
    id_type?: true
    id_no?: true
    id_document_front?: true
    id_document_back?: true
    bvn?: true
    alternate_phone?: true
    next_of_kin_name?: true
    next_of_kin_phone?: true
    next_of_kin_email?: true
    next_of_kin_relationship?: true
    guarantor_name?: true
    guarantor_occupation?: true
    guarantor_work_address?: true
    guarantor_id_no?: true
    guarantor_id_relationship?: true
    signed_guarantor_letter_upload?: true
    vehicle_plate_no?: true
    vehicle_make?: true
    vehicle_color?: true
    proof_of_address_upload?: true
    passport?: true
    tenancy_ownership_doc?: true
    wallet_pin?: true
    ndprConsentDataProcessing?: true
    ndprConsentIdentity?: true
    ndprConsentThirdParty?: true
    ndprConsentGivenAt?: true
    approvedAt?: true
    rejectedAt?: true
    createdAt?: true
  }

  export type ResidentMaxAggregateInputType = {
    id?: true
    first_name?: true
    last_name?: true
    email?: true
    phone?: true
    dob?: true
    gender?: true
    estateId?: true
    userId?: true
    status?: true
    house_no?: true
    block?: true
    home_address?: true
    state_of_origin?: true
    lga?: true
    id_type?: true
    id_no?: true
    id_document_front?: true
    id_document_back?: true
    bvn?: true
    alternate_phone?: true
    next_of_kin_name?: true
    next_of_kin_phone?: true
    next_of_kin_email?: true
    next_of_kin_relationship?: true
    guarantor_name?: true
    guarantor_occupation?: true
    guarantor_work_address?: true
    guarantor_id_no?: true
    guarantor_id_relationship?: true
    signed_guarantor_letter_upload?: true
    vehicle_plate_no?: true
    vehicle_make?: true
    vehicle_color?: true
    proof_of_address_upload?: true
    passport?: true
    tenancy_ownership_doc?: true
    wallet_pin?: true
    ndprConsentDataProcessing?: true
    ndprConsentIdentity?: true
    ndprConsentThirdParty?: true
    ndprConsentGivenAt?: true
    approvedAt?: true
    rejectedAt?: true
    createdAt?: true
  }

  export type ResidentCountAggregateInputType = {
    id?: true
    first_name?: true
    last_name?: true
    email?: true
    phone?: true
    dob?: true
    gender?: true
    estateId?: true
    userId?: true
    status?: true
    house_no?: true
    block?: true
    home_address?: true
    state_of_origin?: true
    lga?: true
    id_type?: true
    id_no?: true
    id_document_front?: true
    id_document_back?: true
    bvn?: true
    alternate_phone?: true
    next_of_kin_name?: true
    next_of_kin_phone?: true
    next_of_kin_email?: true
    next_of_kin_relationship?: true
    guarantor_name?: true
    guarantor_occupation?: true
    guarantor_work_address?: true
    guarantor_id_no?: true
    guarantor_id_relationship?: true
    signed_guarantor_letter_upload?: true
    vehicle_plate_no?: true
    vehicle_make?: true
    vehicle_color?: true
    proof_of_address_upload?: true
    passport?: true
    tenancy_ownership_doc?: true
    wallet_pin?: true
    ndprConsentDataProcessing?: true
    ndprConsentIdentity?: true
    ndprConsentThirdParty?: true
    ndprConsentGivenAt?: true
    approvedAt?: true
    rejectedAt?: true
    createdAt?: true
    _all?: true
  }

  export type ResidentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Resident to aggregate.
     */
    where?: ResidentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Residents to fetch.
     */
    orderBy?: ResidentOrderByWithRelationInput | ResidentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ResidentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Residents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Residents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Residents
    **/
    _count?: true | ResidentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ResidentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ResidentMaxAggregateInputType
  }

  export type GetResidentAggregateType<T extends ResidentAggregateArgs> = {
        [P in keyof T & keyof AggregateResident]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateResident[P]>
      : GetScalarType<T[P], AggregateResident[P]>
  }




  export type ResidentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ResidentWhereInput
    orderBy?: ResidentOrderByWithAggregationInput | ResidentOrderByWithAggregationInput[]
    by: ResidentScalarFieldEnum[] | ResidentScalarFieldEnum
    having?: ResidentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ResidentCountAggregateInputType | true
    _min?: ResidentMinAggregateInputType
    _max?: ResidentMaxAggregateInputType
  }

  export type ResidentGroupByOutputType = {
    id: string
    first_name: string
    last_name: string
    email: string
    phone: string
    dob: string
    gender: string
    estateId: string
    userId: string | null
    status: $Enums.ResidentStatus
    house_no: string
    block: string
    home_address: string
    state_of_origin: string
    lga: string
    id_type: string
    id_no: string
    id_document_front: string
    id_document_back: string
    bvn: string | null
    alternate_phone: string | null
    next_of_kin_name: string | null
    next_of_kin_phone: string | null
    next_of_kin_email: string | null
    next_of_kin_relationship: string | null
    guarantor_name: string
    guarantor_occupation: string
    guarantor_work_address: string
    guarantor_id_no: string
    guarantor_id_relationship: string
    signed_guarantor_letter_upload: string
    vehicle_plate_no: string
    vehicle_make: string
    vehicle_color: string | null
    proof_of_address_upload: string
    passport: string
    tenancy_ownership_doc: string
    wallet_pin: string | null
    ndprConsentDataProcessing: boolean
    ndprConsentIdentity: boolean
    ndprConsentThirdParty: boolean
    ndprConsentGivenAt: Date | null
    approvedAt: Date | null
    rejectedAt: Date | null
    createdAt: Date
    _count: ResidentCountAggregateOutputType | null
    _min: ResidentMinAggregateOutputType | null
    _max: ResidentMaxAggregateOutputType | null
  }

  type GetResidentGroupByPayload<T extends ResidentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ResidentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ResidentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ResidentGroupByOutputType[P]>
            : GetScalarType<T[P], ResidentGroupByOutputType[P]>
        }
      >
    >


  export type ResidentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    first_name?: boolean
    last_name?: boolean
    email?: boolean
    phone?: boolean
    dob?: boolean
    gender?: boolean
    estateId?: boolean
    userId?: boolean
    status?: boolean
    house_no?: boolean
    block?: boolean
    home_address?: boolean
    state_of_origin?: boolean
    lga?: boolean
    id_type?: boolean
    id_no?: boolean
    id_document_front?: boolean
    id_document_back?: boolean
    bvn?: boolean
    alternate_phone?: boolean
    next_of_kin_name?: boolean
    next_of_kin_phone?: boolean
    next_of_kin_email?: boolean
    next_of_kin_relationship?: boolean
    guarantor_name?: boolean
    guarantor_occupation?: boolean
    guarantor_work_address?: boolean
    guarantor_id_no?: boolean
    guarantor_id_relationship?: boolean
    signed_guarantor_letter_upload?: boolean
    vehicle_plate_no?: boolean
    vehicle_make?: boolean
    vehicle_color?: boolean
    proof_of_address_upload?: boolean
    passport?: boolean
    tenancy_ownership_doc?: boolean
    wallet_pin?: boolean
    ndprConsentDataProcessing?: boolean
    ndprConsentIdentity?: boolean
    ndprConsentThirdParty?: boolean
    ndprConsentGivenAt?: boolean
    approvedAt?: boolean
    rejectedAt?: boolean
    createdAt?: boolean
    estate?: boolean | EstateDefaultArgs<ExtArgs>
    user?: boolean | Resident$userArgs<ExtArgs>
    visitors?: boolean | Resident$visitorsArgs<ExtArgs>
    _count?: boolean | ResidentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resident"]>

  export type ResidentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    first_name?: boolean
    last_name?: boolean
    email?: boolean
    phone?: boolean
    dob?: boolean
    gender?: boolean
    estateId?: boolean
    userId?: boolean
    status?: boolean
    house_no?: boolean
    block?: boolean
    home_address?: boolean
    state_of_origin?: boolean
    lga?: boolean
    id_type?: boolean
    id_no?: boolean
    id_document_front?: boolean
    id_document_back?: boolean
    bvn?: boolean
    alternate_phone?: boolean
    next_of_kin_name?: boolean
    next_of_kin_phone?: boolean
    next_of_kin_email?: boolean
    next_of_kin_relationship?: boolean
    guarantor_name?: boolean
    guarantor_occupation?: boolean
    guarantor_work_address?: boolean
    guarantor_id_no?: boolean
    guarantor_id_relationship?: boolean
    signed_guarantor_letter_upload?: boolean
    vehicle_plate_no?: boolean
    vehicle_make?: boolean
    vehicle_color?: boolean
    proof_of_address_upload?: boolean
    passport?: boolean
    tenancy_ownership_doc?: boolean
    wallet_pin?: boolean
    ndprConsentDataProcessing?: boolean
    ndprConsentIdentity?: boolean
    ndprConsentThirdParty?: boolean
    ndprConsentGivenAt?: boolean
    approvedAt?: boolean
    rejectedAt?: boolean
    createdAt?: boolean
    estate?: boolean | EstateDefaultArgs<ExtArgs>
    user?: boolean | Resident$userArgs<ExtArgs>
  }, ExtArgs["result"]["resident"]>

  export type ResidentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    first_name?: boolean
    last_name?: boolean
    email?: boolean
    phone?: boolean
    dob?: boolean
    gender?: boolean
    estateId?: boolean
    userId?: boolean
    status?: boolean
    house_no?: boolean
    block?: boolean
    home_address?: boolean
    state_of_origin?: boolean
    lga?: boolean
    id_type?: boolean
    id_no?: boolean
    id_document_front?: boolean
    id_document_back?: boolean
    bvn?: boolean
    alternate_phone?: boolean
    next_of_kin_name?: boolean
    next_of_kin_phone?: boolean
    next_of_kin_email?: boolean
    next_of_kin_relationship?: boolean
    guarantor_name?: boolean
    guarantor_occupation?: boolean
    guarantor_work_address?: boolean
    guarantor_id_no?: boolean
    guarantor_id_relationship?: boolean
    signed_guarantor_letter_upload?: boolean
    vehicle_plate_no?: boolean
    vehicle_make?: boolean
    vehicle_color?: boolean
    proof_of_address_upload?: boolean
    passport?: boolean
    tenancy_ownership_doc?: boolean
    wallet_pin?: boolean
    ndprConsentDataProcessing?: boolean
    ndprConsentIdentity?: boolean
    ndprConsentThirdParty?: boolean
    ndprConsentGivenAt?: boolean
    approvedAt?: boolean
    rejectedAt?: boolean
    createdAt?: boolean
    estate?: boolean | EstateDefaultArgs<ExtArgs>
    user?: boolean | Resident$userArgs<ExtArgs>
  }, ExtArgs["result"]["resident"]>

  export type ResidentSelectScalar = {
    id?: boolean
    first_name?: boolean
    last_name?: boolean
    email?: boolean
    phone?: boolean
    dob?: boolean
    gender?: boolean
    estateId?: boolean
    userId?: boolean
    status?: boolean
    house_no?: boolean
    block?: boolean
    home_address?: boolean
    state_of_origin?: boolean
    lga?: boolean
    id_type?: boolean
    id_no?: boolean
    id_document_front?: boolean
    id_document_back?: boolean
    bvn?: boolean
    alternate_phone?: boolean
    next_of_kin_name?: boolean
    next_of_kin_phone?: boolean
    next_of_kin_email?: boolean
    next_of_kin_relationship?: boolean
    guarantor_name?: boolean
    guarantor_occupation?: boolean
    guarantor_work_address?: boolean
    guarantor_id_no?: boolean
    guarantor_id_relationship?: boolean
    signed_guarantor_letter_upload?: boolean
    vehicle_plate_no?: boolean
    vehicle_make?: boolean
    vehicle_color?: boolean
    proof_of_address_upload?: boolean
    passport?: boolean
    tenancy_ownership_doc?: boolean
    wallet_pin?: boolean
    ndprConsentDataProcessing?: boolean
    ndprConsentIdentity?: boolean
    ndprConsentThirdParty?: boolean
    ndprConsentGivenAt?: boolean
    approvedAt?: boolean
    rejectedAt?: boolean
    createdAt?: boolean
  }

  export type ResidentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "first_name" | "last_name" | "email" | "phone" | "dob" | "gender" | "estateId" | "userId" | "status" | "house_no" | "block" | "home_address" | "state_of_origin" | "lga" | "id_type" | "id_no" | "id_document_front" | "id_document_back" | "bvn" | "alternate_phone" | "next_of_kin_name" | "next_of_kin_phone" | "next_of_kin_email" | "next_of_kin_relationship" | "guarantor_name" | "guarantor_occupation" | "guarantor_work_address" | "guarantor_id_no" | "guarantor_id_relationship" | "signed_guarantor_letter_upload" | "vehicle_plate_no" | "vehicle_make" | "vehicle_color" | "proof_of_address_upload" | "passport" | "tenancy_ownership_doc" | "wallet_pin" | "ndprConsentDataProcessing" | "ndprConsentIdentity" | "ndprConsentThirdParty" | "ndprConsentGivenAt" | "approvedAt" | "rejectedAt" | "createdAt", ExtArgs["result"]["resident"]>
  export type ResidentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    estate?: boolean | EstateDefaultArgs<ExtArgs>
    user?: boolean | Resident$userArgs<ExtArgs>
    visitors?: boolean | Resident$visitorsArgs<ExtArgs>
    _count?: boolean | ResidentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ResidentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    estate?: boolean | EstateDefaultArgs<ExtArgs>
    user?: boolean | Resident$userArgs<ExtArgs>
  }
  export type ResidentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    estate?: boolean | EstateDefaultArgs<ExtArgs>
    user?: boolean | Resident$userArgs<ExtArgs>
  }

  export type $ResidentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Resident"
    objects: {
      estate: Prisma.$EstatePayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs> | null
      visitors: Prisma.$VisitorPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      first_name: string
      last_name: string
      email: string
      phone: string
      dob: string
      gender: string
      estateId: string
      userId: string | null
      status: $Enums.ResidentStatus
      house_no: string
      block: string
      home_address: string
      state_of_origin: string
      lga: string
      id_type: string
      id_no: string
      id_document_front: string
      id_document_back: string
      bvn: string | null
      alternate_phone: string | null
      next_of_kin_name: string | null
      next_of_kin_phone: string | null
      next_of_kin_email: string | null
      next_of_kin_relationship: string | null
      guarantor_name: string
      guarantor_occupation: string
      guarantor_work_address: string
      guarantor_id_no: string
      guarantor_id_relationship: string
      signed_guarantor_letter_upload: string
      vehicle_plate_no: string
      vehicle_make: string
      vehicle_color: string | null
      proof_of_address_upload: string
      passport: string
      tenancy_ownership_doc: string
      wallet_pin: string | null
      ndprConsentDataProcessing: boolean
      ndprConsentIdentity: boolean
      ndprConsentThirdParty: boolean
      ndprConsentGivenAt: Date | null
      approvedAt: Date | null
      rejectedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["resident"]>
    composites: {}
  }

  type ResidentGetPayload<S extends boolean | null | undefined | ResidentDefaultArgs> = $Result.GetResult<Prisma.$ResidentPayload, S>

  type ResidentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ResidentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ResidentCountAggregateInputType | true
    }

  export interface ResidentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Resident'], meta: { name: 'Resident' } }
    /**
     * Find zero or one Resident that matches the filter.
     * @param {ResidentFindUniqueArgs} args - Arguments to find a Resident
     * @example
     * // Get one Resident
     * const resident = await prisma.resident.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ResidentFindUniqueArgs>(args: SelectSubset<T, ResidentFindUniqueArgs<ExtArgs>>): Prisma__ResidentClient<$Result.GetResult<Prisma.$ResidentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Resident that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ResidentFindUniqueOrThrowArgs} args - Arguments to find a Resident
     * @example
     * // Get one Resident
     * const resident = await prisma.resident.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ResidentFindUniqueOrThrowArgs>(args: SelectSubset<T, ResidentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ResidentClient<$Result.GetResult<Prisma.$ResidentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Resident that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResidentFindFirstArgs} args - Arguments to find a Resident
     * @example
     * // Get one Resident
     * const resident = await prisma.resident.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ResidentFindFirstArgs>(args?: SelectSubset<T, ResidentFindFirstArgs<ExtArgs>>): Prisma__ResidentClient<$Result.GetResult<Prisma.$ResidentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Resident that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResidentFindFirstOrThrowArgs} args - Arguments to find a Resident
     * @example
     * // Get one Resident
     * const resident = await prisma.resident.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ResidentFindFirstOrThrowArgs>(args?: SelectSubset<T, ResidentFindFirstOrThrowArgs<ExtArgs>>): Prisma__ResidentClient<$Result.GetResult<Prisma.$ResidentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Residents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResidentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Residents
     * const residents = await prisma.resident.findMany()
     * 
     * // Get first 10 Residents
     * const residents = await prisma.resident.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const residentWithIdOnly = await prisma.resident.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ResidentFindManyArgs>(args?: SelectSubset<T, ResidentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResidentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Resident.
     * @param {ResidentCreateArgs} args - Arguments to create a Resident.
     * @example
     * // Create one Resident
     * const Resident = await prisma.resident.create({
     *   data: {
     *     // ... data to create a Resident
     *   }
     * })
     * 
     */
    create<T extends ResidentCreateArgs>(args: SelectSubset<T, ResidentCreateArgs<ExtArgs>>): Prisma__ResidentClient<$Result.GetResult<Prisma.$ResidentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Residents.
     * @param {ResidentCreateManyArgs} args - Arguments to create many Residents.
     * @example
     * // Create many Residents
     * const resident = await prisma.resident.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ResidentCreateManyArgs>(args?: SelectSubset<T, ResidentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Residents and returns the data saved in the database.
     * @param {ResidentCreateManyAndReturnArgs} args - Arguments to create many Residents.
     * @example
     * // Create many Residents
     * const resident = await prisma.resident.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Residents and only return the `id`
     * const residentWithIdOnly = await prisma.resident.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ResidentCreateManyAndReturnArgs>(args?: SelectSubset<T, ResidentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResidentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Resident.
     * @param {ResidentDeleteArgs} args - Arguments to delete one Resident.
     * @example
     * // Delete one Resident
     * const Resident = await prisma.resident.delete({
     *   where: {
     *     // ... filter to delete one Resident
     *   }
     * })
     * 
     */
    delete<T extends ResidentDeleteArgs>(args: SelectSubset<T, ResidentDeleteArgs<ExtArgs>>): Prisma__ResidentClient<$Result.GetResult<Prisma.$ResidentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Resident.
     * @param {ResidentUpdateArgs} args - Arguments to update one Resident.
     * @example
     * // Update one Resident
     * const resident = await prisma.resident.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ResidentUpdateArgs>(args: SelectSubset<T, ResidentUpdateArgs<ExtArgs>>): Prisma__ResidentClient<$Result.GetResult<Prisma.$ResidentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Residents.
     * @param {ResidentDeleteManyArgs} args - Arguments to filter Residents to delete.
     * @example
     * // Delete a few Residents
     * const { count } = await prisma.resident.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ResidentDeleteManyArgs>(args?: SelectSubset<T, ResidentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Residents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResidentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Residents
     * const resident = await prisma.resident.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ResidentUpdateManyArgs>(args: SelectSubset<T, ResidentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Residents and returns the data updated in the database.
     * @param {ResidentUpdateManyAndReturnArgs} args - Arguments to update many Residents.
     * @example
     * // Update many Residents
     * const resident = await prisma.resident.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Residents and only return the `id`
     * const residentWithIdOnly = await prisma.resident.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ResidentUpdateManyAndReturnArgs>(args: SelectSubset<T, ResidentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResidentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Resident.
     * @param {ResidentUpsertArgs} args - Arguments to update or create a Resident.
     * @example
     * // Update or create a Resident
     * const resident = await prisma.resident.upsert({
     *   create: {
     *     // ... data to create a Resident
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Resident we want to update
     *   }
     * })
     */
    upsert<T extends ResidentUpsertArgs>(args: SelectSubset<T, ResidentUpsertArgs<ExtArgs>>): Prisma__ResidentClient<$Result.GetResult<Prisma.$ResidentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Residents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResidentCountArgs} args - Arguments to filter Residents to count.
     * @example
     * // Count the number of Residents
     * const count = await prisma.resident.count({
     *   where: {
     *     // ... the filter for the Residents we want to count
     *   }
     * })
    **/
    count<T extends ResidentCountArgs>(
      args?: Subset<T, ResidentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ResidentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Resident.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResidentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ResidentAggregateArgs>(args: Subset<T, ResidentAggregateArgs>): Prisma.PrismaPromise<GetResidentAggregateType<T>>

    /**
     * Group by Resident.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResidentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ResidentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ResidentGroupByArgs['orderBy'] }
        : { orderBy?: ResidentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ResidentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetResidentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Resident model
   */
  readonly fields: ResidentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Resident.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ResidentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    estate<T extends EstateDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EstateDefaultArgs<ExtArgs>>): Prisma__EstateClient<$Result.GetResult<Prisma.$EstatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends Resident$userArgs<ExtArgs> = {}>(args?: Subset<T, Resident$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    visitors<T extends Resident$visitorsArgs<ExtArgs> = {}>(args?: Subset<T, Resident$visitorsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VisitorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Resident model
   */
  interface ResidentFieldRefs {
    readonly id: FieldRef<"Resident", 'String'>
    readonly first_name: FieldRef<"Resident", 'String'>
    readonly last_name: FieldRef<"Resident", 'String'>
    readonly email: FieldRef<"Resident", 'String'>
    readonly phone: FieldRef<"Resident", 'String'>
    readonly dob: FieldRef<"Resident", 'String'>
    readonly gender: FieldRef<"Resident", 'String'>
    readonly estateId: FieldRef<"Resident", 'String'>
    readonly userId: FieldRef<"Resident", 'String'>
    readonly status: FieldRef<"Resident", 'ResidentStatus'>
    readonly house_no: FieldRef<"Resident", 'String'>
    readonly block: FieldRef<"Resident", 'String'>
    readonly home_address: FieldRef<"Resident", 'String'>
    readonly state_of_origin: FieldRef<"Resident", 'String'>
    readonly lga: FieldRef<"Resident", 'String'>
    readonly id_type: FieldRef<"Resident", 'String'>
    readonly id_no: FieldRef<"Resident", 'String'>
    readonly id_document_front: FieldRef<"Resident", 'String'>
    readonly id_document_back: FieldRef<"Resident", 'String'>
    readonly bvn: FieldRef<"Resident", 'String'>
    readonly alternate_phone: FieldRef<"Resident", 'String'>
    readonly next_of_kin_name: FieldRef<"Resident", 'String'>
    readonly next_of_kin_phone: FieldRef<"Resident", 'String'>
    readonly next_of_kin_email: FieldRef<"Resident", 'String'>
    readonly next_of_kin_relationship: FieldRef<"Resident", 'String'>
    readonly guarantor_name: FieldRef<"Resident", 'String'>
    readonly guarantor_occupation: FieldRef<"Resident", 'String'>
    readonly guarantor_work_address: FieldRef<"Resident", 'String'>
    readonly guarantor_id_no: FieldRef<"Resident", 'String'>
    readonly guarantor_id_relationship: FieldRef<"Resident", 'String'>
    readonly signed_guarantor_letter_upload: FieldRef<"Resident", 'String'>
    readonly vehicle_plate_no: FieldRef<"Resident", 'String'>
    readonly vehicle_make: FieldRef<"Resident", 'String'>
    readonly vehicle_color: FieldRef<"Resident", 'String'>
    readonly proof_of_address_upload: FieldRef<"Resident", 'String'>
    readonly passport: FieldRef<"Resident", 'String'>
    readonly tenancy_ownership_doc: FieldRef<"Resident", 'String'>
    readonly wallet_pin: FieldRef<"Resident", 'String'>
    readonly ndprConsentDataProcessing: FieldRef<"Resident", 'Boolean'>
    readonly ndprConsentIdentity: FieldRef<"Resident", 'Boolean'>
    readonly ndprConsentThirdParty: FieldRef<"Resident", 'Boolean'>
    readonly ndprConsentGivenAt: FieldRef<"Resident", 'DateTime'>
    readonly approvedAt: FieldRef<"Resident", 'DateTime'>
    readonly rejectedAt: FieldRef<"Resident", 'DateTime'>
    readonly createdAt: FieldRef<"Resident", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Resident findUnique
   */
  export type ResidentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resident
     */
    select?: ResidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resident
     */
    omit?: ResidentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResidentInclude<ExtArgs> | null
    /**
     * Filter, which Resident to fetch.
     */
    where: ResidentWhereUniqueInput
  }

  /**
   * Resident findUniqueOrThrow
   */
  export type ResidentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resident
     */
    select?: ResidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resident
     */
    omit?: ResidentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResidentInclude<ExtArgs> | null
    /**
     * Filter, which Resident to fetch.
     */
    where: ResidentWhereUniqueInput
  }

  /**
   * Resident findFirst
   */
  export type ResidentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resident
     */
    select?: ResidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resident
     */
    omit?: ResidentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResidentInclude<ExtArgs> | null
    /**
     * Filter, which Resident to fetch.
     */
    where?: ResidentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Residents to fetch.
     */
    orderBy?: ResidentOrderByWithRelationInput | ResidentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Residents.
     */
    cursor?: ResidentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Residents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Residents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Residents.
     */
    distinct?: ResidentScalarFieldEnum | ResidentScalarFieldEnum[]
  }

  /**
   * Resident findFirstOrThrow
   */
  export type ResidentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resident
     */
    select?: ResidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resident
     */
    omit?: ResidentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResidentInclude<ExtArgs> | null
    /**
     * Filter, which Resident to fetch.
     */
    where?: ResidentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Residents to fetch.
     */
    orderBy?: ResidentOrderByWithRelationInput | ResidentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Residents.
     */
    cursor?: ResidentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Residents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Residents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Residents.
     */
    distinct?: ResidentScalarFieldEnum | ResidentScalarFieldEnum[]
  }

  /**
   * Resident findMany
   */
  export type ResidentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resident
     */
    select?: ResidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resident
     */
    omit?: ResidentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResidentInclude<ExtArgs> | null
    /**
     * Filter, which Residents to fetch.
     */
    where?: ResidentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Residents to fetch.
     */
    orderBy?: ResidentOrderByWithRelationInput | ResidentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Residents.
     */
    cursor?: ResidentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Residents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Residents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Residents.
     */
    distinct?: ResidentScalarFieldEnum | ResidentScalarFieldEnum[]
  }

  /**
   * Resident create
   */
  export type ResidentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resident
     */
    select?: ResidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resident
     */
    omit?: ResidentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResidentInclude<ExtArgs> | null
    /**
     * The data needed to create a Resident.
     */
    data: XOR<ResidentCreateInput, ResidentUncheckedCreateInput>
  }

  /**
   * Resident createMany
   */
  export type ResidentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Residents.
     */
    data: ResidentCreateManyInput | ResidentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Resident createManyAndReturn
   */
  export type ResidentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resident
     */
    select?: ResidentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Resident
     */
    omit?: ResidentOmit<ExtArgs> | null
    /**
     * The data used to create many Residents.
     */
    data: ResidentCreateManyInput | ResidentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResidentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Resident update
   */
  export type ResidentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resident
     */
    select?: ResidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resident
     */
    omit?: ResidentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResidentInclude<ExtArgs> | null
    /**
     * The data needed to update a Resident.
     */
    data: XOR<ResidentUpdateInput, ResidentUncheckedUpdateInput>
    /**
     * Choose, which Resident to update.
     */
    where: ResidentWhereUniqueInput
  }

  /**
   * Resident updateMany
   */
  export type ResidentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Residents.
     */
    data: XOR<ResidentUpdateManyMutationInput, ResidentUncheckedUpdateManyInput>
    /**
     * Filter which Residents to update
     */
    where?: ResidentWhereInput
    /**
     * Limit how many Residents to update.
     */
    limit?: number
  }

  /**
   * Resident updateManyAndReturn
   */
  export type ResidentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resident
     */
    select?: ResidentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Resident
     */
    omit?: ResidentOmit<ExtArgs> | null
    /**
     * The data used to update Residents.
     */
    data: XOR<ResidentUpdateManyMutationInput, ResidentUncheckedUpdateManyInput>
    /**
     * Filter which Residents to update
     */
    where?: ResidentWhereInput
    /**
     * Limit how many Residents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResidentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Resident upsert
   */
  export type ResidentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resident
     */
    select?: ResidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resident
     */
    omit?: ResidentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResidentInclude<ExtArgs> | null
    /**
     * The filter to search for the Resident to update in case it exists.
     */
    where: ResidentWhereUniqueInput
    /**
     * In case the Resident found by the `where` argument doesn't exist, create a new Resident with this data.
     */
    create: XOR<ResidentCreateInput, ResidentUncheckedCreateInput>
    /**
     * In case the Resident was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ResidentUpdateInput, ResidentUncheckedUpdateInput>
  }

  /**
   * Resident delete
   */
  export type ResidentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resident
     */
    select?: ResidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resident
     */
    omit?: ResidentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResidentInclude<ExtArgs> | null
    /**
     * Filter which Resident to delete.
     */
    where: ResidentWhereUniqueInput
  }

  /**
   * Resident deleteMany
   */
  export type ResidentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Residents to delete
     */
    where?: ResidentWhereInput
    /**
     * Limit how many Residents to delete.
     */
    limit?: number
  }

  /**
   * Resident.user
   */
  export type Resident$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Resident.visitors
   */
  export type Resident$visitorsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Visitor
     */
    select?: VisitorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Visitor
     */
    omit?: VisitorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitorInclude<ExtArgs> | null
    where?: VisitorWhereInput
    orderBy?: VisitorOrderByWithRelationInput | VisitorOrderByWithRelationInput[]
    cursor?: VisitorWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VisitorScalarFieldEnum | VisitorScalarFieldEnum[]
  }

  /**
   * Resident without action
   */
  export type ResidentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resident
     */
    select?: ResidentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resident
     */
    omit?: ResidentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResidentInclude<ExtArgs> | null
  }


  /**
   * Model Visitor
   */

  export type AggregateVisitor = {
    _count: VisitorCountAggregateOutputType | null
    _min: VisitorMinAggregateOutputType | null
    _max: VisitorMaxAggregateOutputType | null
  }

  export type VisitorMinAggregateOutputType = {
    id: string | null
    estateId: string | null
    residentId: string | null
    name: string | null
    phone: string | null
    status: $Enums.VisitorStatus | null
    visitDate: Date | null
    createdAt: Date | null
  }

  export type VisitorMaxAggregateOutputType = {
    id: string | null
    estateId: string | null
    residentId: string | null
    name: string | null
    phone: string | null
    status: $Enums.VisitorStatus | null
    visitDate: Date | null
    createdAt: Date | null
  }

  export type VisitorCountAggregateOutputType = {
    id: number
    estateId: number
    residentId: number
    name: number
    phone: number
    status: number
    visitDate: number
    createdAt: number
    _all: number
  }


  export type VisitorMinAggregateInputType = {
    id?: true
    estateId?: true
    residentId?: true
    name?: true
    phone?: true
    status?: true
    visitDate?: true
    createdAt?: true
  }

  export type VisitorMaxAggregateInputType = {
    id?: true
    estateId?: true
    residentId?: true
    name?: true
    phone?: true
    status?: true
    visitDate?: true
    createdAt?: true
  }

  export type VisitorCountAggregateInputType = {
    id?: true
    estateId?: true
    residentId?: true
    name?: true
    phone?: true
    status?: true
    visitDate?: true
    createdAt?: true
    _all?: true
  }

  export type VisitorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Visitor to aggregate.
     */
    where?: VisitorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Visitors to fetch.
     */
    orderBy?: VisitorOrderByWithRelationInput | VisitorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VisitorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Visitors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Visitors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Visitors
    **/
    _count?: true | VisitorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VisitorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VisitorMaxAggregateInputType
  }

  export type GetVisitorAggregateType<T extends VisitorAggregateArgs> = {
        [P in keyof T & keyof AggregateVisitor]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVisitor[P]>
      : GetScalarType<T[P], AggregateVisitor[P]>
  }




  export type VisitorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VisitorWhereInput
    orderBy?: VisitorOrderByWithAggregationInput | VisitorOrderByWithAggregationInput[]
    by: VisitorScalarFieldEnum[] | VisitorScalarFieldEnum
    having?: VisitorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VisitorCountAggregateInputType | true
    _min?: VisitorMinAggregateInputType
    _max?: VisitorMaxAggregateInputType
  }

  export type VisitorGroupByOutputType = {
    id: string
    estateId: string
    residentId: string
    name: string
    phone: string | null
    status: $Enums.VisitorStatus
    visitDate: Date
    createdAt: Date
    _count: VisitorCountAggregateOutputType | null
    _min: VisitorMinAggregateOutputType | null
    _max: VisitorMaxAggregateOutputType | null
  }

  type GetVisitorGroupByPayload<T extends VisitorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VisitorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VisitorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VisitorGroupByOutputType[P]>
            : GetScalarType<T[P], VisitorGroupByOutputType[P]>
        }
      >
    >


  export type VisitorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    estateId?: boolean
    residentId?: boolean
    name?: boolean
    phone?: boolean
    status?: boolean
    visitDate?: boolean
    createdAt?: boolean
    estate?: boolean | EstateDefaultArgs<ExtArgs>
    resident?: boolean | ResidentDefaultArgs<ExtArgs>
    gateLogs?: boolean | Visitor$gateLogsArgs<ExtArgs>
    _count?: boolean | VisitorCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["visitor"]>

  export type VisitorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    estateId?: boolean
    residentId?: boolean
    name?: boolean
    phone?: boolean
    status?: boolean
    visitDate?: boolean
    createdAt?: boolean
    estate?: boolean | EstateDefaultArgs<ExtArgs>
    resident?: boolean | ResidentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["visitor"]>

  export type VisitorSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    estateId?: boolean
    residentId?: boolean
    name?: boolean
    phone?: boolean
    status?: boolean
    visitDate?: boolean
    createdAt?: boolean
    estate?: boolean | EstateDefaultArgs<ExtArgs>
    resident?: boolean | ResidentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["visitor"]>

  export type VisitorSelectScalar = {
    id?: boolean
    estateId?: boolean
    residentId?: boolean
    name?: boolean
    phone?: boolean
    status?: boolean
    visitDate?: boolean
    createdAt?: boolean
  }

  export type VisitorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "estateId" | "residentId" | "name" | "phone" | "status" | "visitDate" | "createdAt", ExtArgs["result"]["visitor"]>
  export type VisitorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    estate?: boolean | EstateDefaultArgs<ExtArgs>
    resident?: boolean | ResidentDefaultArgs<ExtArgs>
    gateLogs?: boolean | Visitor$gateLogsArgs<ExtArgs>
    _count?: boolean | VisitorCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type VisitorIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    estate?: boolean | EstateDefaultArgs<ExtArgs>
    resident?: boolean | ResidentDefaultArgs<ExtArgs>
  }
  export type VisitorIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    estate?: boolean | EstateDefaultArgs<ExtArgs>
    resident?: boolean | ResidentDefaultArgs<ExtArgs>
  }

  export type $VisitorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Visitor"
    objects: {
      estate: Prisma.$EstatePayload<ExtArgs>
      resident: Prisma.$ResidentPayload<ExtArgs>
      gateLogs: Prisma.$GateLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      estateId: string
      residentId: string
      name: string
      phone: string | null
      status: $Enums.VisitorStatus
      visitDate: Date
      createdAt: Date
    }, ExtArgs["result"]["visitor"]>
    composites: {}
  }

  type VisitorGetPayload<S extends boolean | null | undefined | VisitorDefaultArgs> = $Result.GetResult<Prisma.$VisitorPayload, S>

  type VisitorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VisitorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VisitorCountAggregateInputType | true
    }

  export interface VisitorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Visitor'], meta: { name: 'Visitor' } }
    /**
     * Find zero or one Visitor that matches the filter.
     * @param {VisitorFindUniqueArgs} args - Arguments to find a Visitor
     * @example
     * // Get one Visitor
     * const visitor = await prisma.visitor.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VisitorFindUniqueArgs>(args: SelectSubset<T, VisitorFindUniqueArgs<ExtArgs>>): Prisma__VisitorClient<$Result.GetResult<Prisma.$VisitorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Visitor that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VisitorFindUniqueOrThrowArgs} args - Arguments to find a Visitor
     * @example
     * // Get one Visitor
     * const visitor = await prisma.visitor.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VisitorFindUniqueOrThrowArgs>(args: SelectSubset<T, VisitorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VisitorClient<$Result.GetResult<Prisma.$VisitorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Visitor that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitorFindFirstArgs} args - Arguments to find a Visitor
     * @example
     * // Get one Visitor
     * const visitor = await prisma.visitor.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VisitorFindFirstArgs>(args?: SelectSubset<T, VisitorFindFirstArgs<ExtArgs>>): Prisma__VisitorClient<$Result.GetResult<Prisma.$VisitorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Visitor that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitorFindFirstOrThrowArgs} args - Arguments to find a Visitor
     * @example
     * // Get one Visitor
     * const visitor = await prisma.visitor.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VisitorFindFirstOrThrowArgs>(args?: SelectSubset<T, VisitorFindFirstOrThrowArgs<ExtArgs>>): Prisma__VisitorClient<$Result.GetResult<Prisma.$VisitorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Visitors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Visitors
     * const visitors = await prisma.visitor.findMany()
     * 
     * // Get first 10 Visitors
     * const visitors = await prisma.visitor.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const visitorWithIdOnly = await prisma.visitor.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VisitorFindManyArgs>(args?: SelectSubset<T, VisitorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VisitorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Visitor.
     * @param {VisitorCreateArgs} args - Arguments to create a Visitor.
     * @example
     * // Create one Visitor
     * const Visitor = await prisma.visitor.create({
     *   data: {
     *     // ... data to create a Visitor
     *   }
     * })
     * 
     */
    create<T extends VisitorCreateArgs>(args: SelectSubset<T, VisitorCreateArgs<ExtArgs>>): Prisma__VisitorClient<$Result.GetResult<Prisma.$VisitorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Visitors.
     * @param {VisitorCreateManyArgs} args - Arguments to create many Visitors.
     * @example
     * // Create many Visitors
     * const visitor = await prisma.visitor.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VisitorCreateManyArgs>(args?: SelectSubset<T, VisitorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Visitors and returns the data saved in the database.
     * @param {VisitorCreateManyAndReturnArgs} args - Arguments to create many Visitors.
     * @example
     * // Create many Visitors
     * const visitor = await prisma.visitor.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Visitors and only return the `id`
     * const visitorWithIdOnly = await prisma.visitor.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VisitorCreateManyAndReturnArgs>(args?: SelectSubset<T, VisitorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VisitorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Visitor.
     * @param {VisitorDeleteArgs} args - Arguments to delete one Visitor.
     * @example
     * // Delete one Visitor
     * const Visitor = await prisma.visitor.delete({
     *   where: {
     *     // ... filter to delete one Visitor
     *   }
     * })
     * 
     */
    delete<T extends VisitorDeleteArgs>(args: SelectSubset<T, VisitorDeleteArgs<ExtArgs>>): Prisma__VisitorClient<$Result.GetResult<Prisma.$VisitorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Visitor.
     * @param {VisitorUpdateArgs} args - Arguments to update one Visitor.
     * @example
     * // Update one Visitor
     * const visitor = await prisma.visitor.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VisitorUpdateArgs>(args: SelectSubset<T, VisitorUpdateArgs<ExtArgs>>): Prisma__VisitorClient<$Result.GetResult<Prisma.$VisitorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Visitors.
     * @param {VisitorDeleteManyArgs} args - Arguments to filter Visitors to delete.
     * @example
     * // Delete a few Visitors
     * const { count } = await prisma.visitor.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VisitorDeleteManyArgs>(args?: SelectSubset<T, VisitorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Visitors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Visitors
     * const visitor = await prisma.visitor.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VisitorUpdateManyArgs>(args: SelectSubset<T, VisitorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Visitors and returns the data updated in the database.
     * @param {VisitorUpdateManyAndReturnArgs} args - Arguments to update many Visitors.
     * @example
     * // Update many Visitors
     * const visitor = await prisma.visitor.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Visitors and only return the `id`
     * const visitorWithIdOnly = await prisma.visitor.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VisitorUpdateManyAndReturnArgs>(args: SelectSubset<T, VisitorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VisitorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Visitor.
     * @param {VisitorUpsertArgs} args - Arguments to update or create a Visitor.
     * @example
     * // Update or create a Visitor
     * const visitor = await prisma.visitor.upsert({
     *   create: {
     *     // ... data to create a Visitor
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Visitor we want to update
     *   }
     * })
     */
    upsert<T extends VisitorUpsertArgs>(args: SelectSubset<T, VisitorUpsertArgs<ExtArgs>>): Prisma__VisitorClient<$Result.GetResult<Prisma.$VisitorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Visitors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitorCountArgs} args - Arguments to filter Visitors to count.
     * @example
     * // Count the number of Visitors
     * const count = await prisma.visitor.count({
     *   where: {
     *     // ... the filter for the Visitors we want to count
     *   }
     * })
    **/
    count<T extends VisitorCountArgs>(
      args?: Subset<T, VisitorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VisitorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Visitor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VisitorAggregateArgs>(args: Subset<T, VisitorAggregateArgs>): Prisma.PrismaPromise<GetVisitorAggregateType<T>>

    /**
     * Group by Visitor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VisitorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VisitorGroupByArgs['orderBy'] }
        : { orderBy?: VisitorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VisitorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVisitorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Visitor model
   */
  readonly fields: VisitorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Visitor.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VisitorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    estate<T extends EstateDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EstateDefaultArgs<ExtArgs>>): Prisma__EstateClient<$Result.GetResult<Prisma.$EstatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    resident<T extends ResidentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ResidentDefaultArgs<ExtArgs>>): Prisma__ResidentClient<$Result.GetResult<Prisma.$ResidentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    gateLogs<T extends Visitor$gateLogsArgs<ExtArgs> = {}>(args?: Subset<T, Visitor$gateLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GateLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Visitor model
   */
  interface VisitorFieldRefs {
    readonly id: FieldRef<"Visitor", 'String'>
    readonly estateId: FieldRef<"Visitor", 'String'>
    readonly residentId: FieldRef<"Visitor", 'String'>
    readonly name: FieldRef<"Visitor", 'String'>
    readonly phone: FieldRef<"Visitor", 'String'>
    readonly status: FieldRef<"Visitor", 'VisitorStatus'>
    readonly visitDate: FieldRef<"Visitor", 'DateTime'>
    readonly createdAt: FieldRef<"Visitor", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Visitor findUnique
   */
  export type VisitorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Visitor
     */
    select?: VisitorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Visitor
     */
    omit?: VisitorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitorInclude<ExtArgs> | null
    /**
     * Filter, which Visitor to fetch.
     */
    where: VisitorWhereUniqueInput
  }

  /**
   * Visitor findUniqueOrThrow
   */
  export type VisitorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Visitor
     */
    select?: VisitorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Visitor
     */
    omit?: VisitorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitorInclude<ExtArgs> | null
    /**
     * Filter, which Visitor to fetch.
     */
    where: VisitorWhereUniqueInput
  }

  /**
   * Visitor findFirst
   */
  export type VisitorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Visitor
     */
    select?: VisitorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Visitor
     */
    omit?: VisitorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitorInclude<ExtArgs> | null
    /**
     * Filter, which Visitor to fetch.
     */
    where?: VisitorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Visitors to fetch.
     */
    orderBy?: VisitorOrderByWithRelationInput | VisitorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Visitors.
     */
    cursor?: VisitorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Visitors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Visitors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Visitors.
     */
    distinct?: VisitorScalarFieldEnum | VisitorScalarFieldEnum[]
  }

  /**
   * Visitor findFirstOrThrow
   */
  export type VisitorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Visitor
     */
    select?: VisitorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Visitor
     */
    omit?: VisitorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitorInclude<ExtArgs> | null
    /**
     * Filter, which Visitor to fetch.
     */
    where?: VisitorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Visitors to fetch.
     */
    orderBy?: VisitorOrderByWithRelationInput | VisitorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Visitors.
     */
    cursor?: VisitorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Visitors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Visitors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Visitors.
     */
    distinct?: VisitorScalarFieldEnum | VisitorScalarFieldEnum[]
  }

  /**
   * Visitor findMany
   */
  export type VisitorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Visitor
     */
    select?: VisitorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Visitor
     */
    omit?: VisitorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitorInclude<ExtArgs> | null
    /**
     * Filter, which Visitors to fetch.
     */
    where?: VisitorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Visitors to fetch.
     */
    orderBy?: VisitorOrderByWithRelationInput | VisitorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Visitors.
     */
    cursor?: VisitorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Visitors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Visitors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Visitors.
     */
    distinct?: VisitorScalarFieldEnum | VisitorScalarFieldEnum[]
  }

  /**
   * Visitor create
   */
  export type VisitorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Visitor
     */
    select?: VisitorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Visitor
     */
    omit?: VisitorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitorInclude<ExtArgs> | null
    /**
     * The data needed to create a Visitor.
     */
    data: XOR<VisitorCreateInput, VisitorUncheckedCreateInput>
  }

  /**
   * Visitor createMany
   */
  export type VisitorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Visitors.
     */
    data: VisitorCreateManyInput | VisitorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Visitor createManyAndReturn
   */
  export type VisitorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Visitor
     */
    select?: VisitorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Visitor
     */
    omit?: VisitorOmit<ExtArgs> | null
    /**
     * The data used to create many Visitors.
     */
    data: VisitorCreateManyInput | VisitorCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitorIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Visitor update
   */
  export type VisitorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Visitor
     */
    select?: VisitorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Visitor
     */
    omit?: VisitorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitorInclude<ExtArgs> | null
    /**
     * The data needed to update a Visitor.
     */
    data: XOR<VisitorUpdateInput, VisitorUncheckedUpdateInput>
    /**
     * Choose, which Visitor to update.
     */
    where: VisitorWhereUniqueInput
  }

  /**
   * Visitor updateMany
   */
  export type VisitorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Visitors.
     */
    data: XOR<VisitorUpdateManyMutationInput, VisitorUncheckedUpdateManyInput>
    /**
     * Filter which Visitors to update
     */
    where?: VisitorWhereInput
    /**
     * Limit how many Visitors to update.
     */
    limit?: number
  }

  /**
   * Visitor updateManyAndReturn
   */
  export type VisitorUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Visitor
     */
    select?: VisitorSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Visitor
     */
    omit?: VisitorOmit<ExtArgs> | null
    /**
     * The data used to update Visitors.
     */
    data: XOR<VisitorUpdateManyMutationInput, VisitorUncheckedUpdateManyInput>
    /**
     * Filter which Visitors to update
     */
    where?: VisitorWhereInput
    /**
     * Limit how many Visitors to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitorIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Visitor upsert
   */
  export type VisitorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Visitor
     */
    select?: VisitorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Visitor
     */
    omit?: VisitorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitorInclude<ExtArgs> | null
    /**
     * The filter to search for the Visitor to update in case it exists.
     */
    where: VisitorWhereUniqueInput
    /**
     * In case the Visitor found by the `where` argument doesn't exist, create a new Visitor with this data.
     */
    create: XOR<VisitorCreateInput, VisitorUncheckedCreateInput>
    /**
     * In case the Visitor was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VisitorUpdateInput, VisitorUncheckedUpdateInput>
  }

  /**
   * Visitor delete
   */
  export type VisitorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Visitor
     */
    select?: VisitorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Visitor
     */
    omit?: VisitorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitorInclude<ExtArgs> | null
    /**
     * Filter which Visitor to delete.
     */
    where: VisitorWhereUniqueInput
  }

  /**
   * Visitor deleteMany
   */
  export type VisitorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Visitors to delete
     */
    where?: VisitorWhereInput
    /**
     * Limit how many Visitors to delete.
     */
    limit?: number
  }

  /**
   * Visitor.gateLogs
   */
  export type Visitor$gateLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GateLog
     */
    select?: GateLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GateLog
     */
    omit?: GateLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GateLogInclude<ExtArgs> | null
    where?: GateLogWhereInput
    orderBy?: GateLogOrderByWithRelationInput | GateLogOrderByWithRelationInput[]
    cursor?: GateLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GateLogScalarFieldEnum | GateLogScalarFieldEnum[]
  }

  /**
   * Visitor without action
   */
  export type VisitorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Visitor
     */
    select?: VisitorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Visitor
     */
    omit?: VisitorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitorInclude<ExtArgs> | null
  }


  /**
   * Model GateLog
   */

  export type AggregateGateLog = {
    _count: GateLogCountAggregateOutputType | null
    _min: GateLogMinAggregateOutputType | null
    _max: GateLogMaxAggregateOutputType | null
  }

  export type GateLogMinAggregateOutputType = {
    id: string | null
    visitorId: string | null
    guardId: string | null
    action: string | null
    timestamp: Date | null
  }

  export type GateLogMaxAggregateOutputType = {
    id: string | null
    visitorId: string | null
    guardId: string | null
    action: string | null
    timestamp: Date | null
  }

  export type GateLogCountAggregateOutputType = {
    id: number
    visitorId: number
    guardId: number
    action: number
    timestamp: number
    _all: number
  }


  export type GateLogMinAggregateInputType = {
    id?: true
    visitorId?: true
    guardId?: true
    action?: true
    timestamp?: true
  }

  export type GateLogMaxAggregateInputType = {
    id?: true
    visitorId?: true
    guardId?: true
    action?: true
    timestamp?: true
  }

  export type GateLogCountAggregateInputType = {
    id?: true
    visitorId?: true
    guardId?: true
    action?: true
    timestamp?: true
    _all?: true
  }

  export type GateLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GateLog to aggregate.
     */
    where?: GateLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GateLogs to fetch.
     */
    orderBy?: GateLogOrderByWithRelationInput | GateLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GateLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GateLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GateLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GateLogs
    **/
    _count?: true | GateLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GateLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GateLogMaxAggregateInputType
  }

  export type GetGateLogAggregateType<T extends GateLogAggregateArgs> = {
        [P in keyof T & keyof AggregateGateLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGateLog[P]>
      : GetScalarType<T[P], AggregateGateLog[P]>
  }




  export type GateLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GateLogWhereInput
    orderBy?: GateLogOrderByWithAggregationInput | GateLogOrderByWithAggregationInput[]
    by: GateLogScalarFieldEnum[] | GateLogScalarFieldEnum
    having?: GateLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GateLogCountAggregateInputType | true
    _min?: GateLogMinAggregateInputType
    _max?: GateLogMaxAggregateInputType
  }

  export type GateLogGroupByOutputType = {
    id: string
    visitorId: string
    guardId: string
    action: string
    timestamp: Date
    _count: GateLogCountAggregateOutputType | null
    _min: GateLogMinAggregateOutputType | null
    _max: GateLogMaxAggregateOutputType | null
  }

  type GetGateLogGroupByPayload<T extends GateLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GateLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GateLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GateLogGroupByOutputType[P]>
            : GetScalarType<T[P], GateLogGroupByOutputType[P]>
        }
      >
    >


  export type GateLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    visitorId?: boolean
    guardId?: boolean
    action?: boolean
    timestamp?: boolean
    guard?: boolean | UserDefaultArgs<ExtArgs>
    visitor?: boolean | VisitorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gateLog"]>

  export type GateLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    visitorId?: boolean
    guardId?: boolean
    action?: boolean
    timestamp?: boolean
    guard?: boolean | UserDefaultArgs<ExtArgs>
    visitor?: boolean | VisitorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gateLog"]>

  export type GateLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    visitorId?: boolean
    guardId?: boolean
    action?: boolean
    timestamp?: boolean
    guard?: boolean | UserDefaultArgs<ExtArgs>
    visitor?: boolean | VisitorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gateLog"]>

  export type GateLogSelectScalar = {
    id?: boolean
    visitorId?: boolean
    guardId?: boolean
    action?: boolean
    timestamp?: boolean
  }

  export type GateLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "visitorId" | "guardId" | "action" | "timestamp", ExtArgs["result"]["gateLog"]>
  export type GateLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    guard?: boolean | UserDefaultArgs<ExtArgs>
    visitor?: boolean | VisitorDefaultArgs<ExtArgs>
  }
  export type GateLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    guard?: boolean | UserDefaultArgs<ExtArgs>
    visitor?: boolean | VisitorDefaultArgs<ExtArgs>
  }
  export type GateLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    guard?: boolean | UserDefaultArgs<ExtArgs>
    visitor?: boolean | VisitorDefaultArgs<ExtArgs>
  }

  export type $GateLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GateLog"
    objects: {
      guard: Prisma.$UserPayload<ExtArgs>
      visitor: Prisma.$VisitorPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      visitorId: string
      guardId: string
      action: string
      timestamp: Date
    }, ExtArgs["result"]["gateLog"]>
    composites: {}
  }

  type GateLogGetPayload<S extends boolean | null | undefined | GateLogDefaultArgs> = $Result.GetResult<Prisma.$GateLogPayload, S>

  type GateLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GateLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GateLogCountAggregateInputType | true
    }

  export interface GateLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GateLog'], meta: { name: 'GateLog' } }
    /**
     * Find zero or one GateLog that matches the filter.
     * @param {GateLogFindUniqueArgs} args - Arguments to find a GateLog
     * @example
     * // Get one GateLog
     * const gateLog = await prisma.gateLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GateLogFindUniqueArgs>(args: SelectSubset<T, GateLogFindUniqueArgs<ExtArgs>>): Prisma__GateLogClient<$Result.GetResult<Prisma.$GateLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GateLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GateLogFindUniqueOrThrowArgs} args - Arguments to find a GateLog
     * @example
     * // Get one GateLog
     * const gateLog = await prisma.gateLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GateLogFindUniqueOrThrowArgs>(args: SelectSubset<T, GateLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GateLogClient<$Result.GetResult<Prisma.$GateLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GateLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GateLogFindFirstArgs} args - Arguments to find a GateLog
     * @example
     * // Get one GateLog
     * const gateLog = await prisma.gateLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GateLogFindFirstArgs>(args?: SelectSubset<T, GateLogFindFirstArgs<ExtArgs>>): Prisma__GateLogClient<$Result.GetResult<Prisma.$GateLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GateLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GateLogFindFirstOrThrowArgs} args - Arguments to find a GateLog
     * @example
     * // Get one GateLog
     * const gateLog = await prisma.gateLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GateLogFindFirstOrThrowArgs>(args?: SelectSubset<T, GateLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__GateLogClient<$Result.GetResult<Prisma.$GateLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GateLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GateLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GateLogs
     * const gateLogs = await prisma.gateLog.findMany()
     * 
     * // Get first 10 GateLogs
     * const gateLogs = await prisma.gateLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gateLogWithIdOnly = await prisma.gateLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GateLogFindManyArgs>(args?: SelectSubset<T, GateLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GateLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GateLog.
     * @param {GateLogCreateArgs} args - Arguments to create a GateLog.
     * @example
     * // Create one GateLog
     * const GateLog = await prisma.gateLog.create({
     *   data: {
     *     // ... data to create a GateLog
     *   }
     * })
     * 
     */
    create<T extends GateLogCreateArgs>(args: SelectSubset<T, GateLogCreateArgs<ExtArgs>>): Prisma__GateLogClient<$Result.GetResult<Prisma.$GateLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GateLogs.
     * @param {GateLogCreateManyArgs} args - Arguments to create many GateLogs.
     * @example
     * // Create many GateLogs
     * const gateLog = await prisma.gateLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GateLogCreateManyArgs>(args?: SelectSubset<T, GateLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GateLogs and returns the data saved in the database.
     * @param {GateLogCreateManyAndReturnArgs} args - Arguments to create many GateLogs.
     * @example
     * // Create many GateLogs
     * const gateLog = await prisma.gateLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GateLogs and only return the `id`
     * const gateLogWithIdOnly = await prisma.gateLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GateLogCreateManyAndReturnArgs>(args?: SelectSubset<T, GateLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GateLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GateLog.
     * @param {GateLogDeleteArgs} args - Arguments to delete one GateLog.
     * @example
     * // Delete one GateLog
     * const GateLog = await prisma.gateLog.delete({
     *   where: {
     *     // ... filter to delete one GateLog
     *   }
     * })
     * 
     */
    delete<T extends GateLogDeleteArgs>(args: SelectSubset<T, GateLogDeleteArgs<ExtArgs>>): Prisma__GateLogClient<$Result.GetResult<Prisma.$GateLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GateLog.
     * @param {GateLogUpdateArgs} args - Arguments to update one GateLog.
     * @example
     * // Update one GateLog
     * const gateLog = await prisma.gateLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GateLogUpdateArgs>(args: SelectSubset<T, GateLogUpdateArgs<ExtArgs>>): Prisma__GateLogClient<$Result.GetResult<Prisma.$GateLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GateLogs.
     * @param {GateLogDeleteManyArgs} args - Arguments to filter GateLogs to delete.
     * @example
     * // Delete a few GateLogs
     * const { count } = await prisma.gateLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GateLogDeleteManyArgs>(args?: SelectSubset<T, GateLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GateLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GateLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GateLogs
     * const gateLog = await prisma.gateLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GateLogUpdateManyArgs>(args: SelectSubset<T, GateLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GateLogs and returns the data updated in the database.
     * @param {GateLogUpdateManyAndReturnArgs} args - Arguments to update many GateLogs.
     * @example
     * // Update many GateLogs
     * const gateLog = await prisma.gateLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GateLogs and only return the `id`
     * const gateLogWithIdOnly = await prisma.gateLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GateLogUpdateManyAndReturnArgs>(args: SelectSubset<T, GateLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GateLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GateLog.
     * @param {GateLogUpsertArgs} args - Arguments to update or create a GateLog.
     * @example
     * // Update or create a GateLog
     * const gateLog = await prisma.gateLog.upsert({
     *   create: {
     *     // ... data to create a GateLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GateLog we want to update
     *   }
     * })
     */
    upsert<T extends GateLogUpsertArgs>(args: SelectSubset<T, GateLogUpsertArgs<ExtArgs>>): Prisma__GateLogClient<$Result.GetResult<Prisma.$GateLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GateLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GateLogCountArgs} args - Arguments to filter GateLogs to count.
     * @example
     * // Count the number of GateLogs
     * const count = await prisma.gateLog.count({
     *   where: {
     *     // ... the filter for the GateLogs we want to count
     *   }
     * })
    **/
    count<T extends GateLogCountArgs>(
      args?: Subset<T, GateLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GateLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GateLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GateLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GateLogAggregateArgs>(args: Subset<T, GateLogAggregateArgs>): Prisma.PrismaPromise<GetGateLogAggregateType<T>>

    /**
     * Group by GateLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GateLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GateLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GateLogGroupByArgs['orderBy'] }
        : { orderBy?: GateLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GateLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGateLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GateLog model
   */
  readonly fields: GateLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GateLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GateLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    guard<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    visitor<T extends VisitorDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VisitorDefaultArgs<ExtArgs>>): Prisma__VisitorClient<$Result.GetResult<Prisma.$VisitorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GateLog model
   */
  interface GateLogFieldRefs {
    readonly id: FieldRef<"GateLog", 'String'>
    readonly visitorId: FieldRef<"GateLog", 'String'>
    readonly guardId: FieldRef<"GateLog", 'String'>
    readonly action: FieldRef<"GateLog", 'String'>
    readonly timestamp: FieldRef<"GateLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GateLog findUnique
   */
  export type GateLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GateLog
     */
    select?: GateLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GateLog
     */
    omit?: GateLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GateLogInclude<ExtArgs> | null
    /**
     * Filter, which GateLog to fetch.
     */
    where: GateLogWhereUniqueInput
  }

  /**
   * GateLog findUniqueOrThrow
   */
  export type GateLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GateLog
     */
    select?: GateLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GateLog
     */
    omit?: GateLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GateLogInclude<ExtArgs> | null
    /**
     * Filter, which GateLog to fetch.
     */
    where: GateLogWhereUniqueInput
  }

  /**
   * GateLog findFirst
   */
  export type GateLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GateLog
     */
    select?: GateLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GateLog
     */
    omit?: GateLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GateLogInclude<ExtArgs> | null
    /**
     * Filter, which GateLog to fetch.
     */
    where?: GateLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GateLogs to fetch.
     */
    orderBy?: GateLogOrderByWithRelationInput | GateLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GateLogs.
     */
    cursor?: GateLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GateLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GateLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GateLogs.
     */
    distinct?: GateLogScalarFieldEnum | GateLogScalarFieldEnum[]
  }

  /**
   * GateLog findFirstOrThrow
   */
  export type GateLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GateLog
     */
    select?: GateLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GateLog
     */
    omit?: GateLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GateLogInclude<ExtArgs> | null
    /**
     * Filter, which GateLog to fetch.
     */
    where?: GateLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GateLogs to fetch.
     */
    orderBy?: GateLogOrderByWithRelationInput | GateLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GateLogs.
     */
    cursor?: GateLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GateLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GateLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GateLogs.
     */
    distinct?: GateLogScalarFieldEnum | GateLogScalarFieldEnum[]
  }

  /**
   * GateLog findMany
   */
  export type GateLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GateLog
     */
    select?: GateLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GateLog
     */
    omit?: GateLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GateLogInclude<ExtArgs> | null
    /**
     * Filter, which GateLogs to fetch.
     */
    where?: GateLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GateLogs to fetch.
     */
    orderBy?: GateLogOrderByWithRelationInput | GateLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GateLogs.
     */
    cursor?: GateLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GateLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GateLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GateLogs.
     */
    distinct?: GateLogScalarFieldEnum | GateLogScalarFieldEnum[]
  }

  /**
   * GateLog create
   */
  export type GateLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GateLog
     */
    select?: GateLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GateLog
     */
    omit?: GateLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GateLogInclude<ExtArgs> | null
    /**
     * The data needed to create a GateLog.
     */
    data: XOR<GateLogCreateInput, GateLogUncheckedCreateInput>
  }

  /**
   * GateLog createMany
   */
  export type GateLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GateLogs.
     */
    data: GateLogCreateManyInput | GateLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GateLog createManyAndReturn
   */
  export type GateLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GateLog
     */
    select?: GateLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GateLog
     */
    omit?: GateLogOmit<ExtArgs> | null
    /**
     * The data used to create many GateLogs.
     */
    data: GateLogCreateManyInput | GateLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GateLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GateLog update
   */
  export type GateLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GateLog
     */
    select?: GateLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GateLog
     */
    omit?: GateLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GateLogInclude<ExtArgs> | null
    /**
     * The data needed to update a GateLog.
     */
    data: XOR<GateLogUpdateInput, GateLogUncheckedUpdateInput>
    /**
     * Choose, which GateLog to update.
     */
    where: GateLogWhereUniqueInput
  }

  /**
   * GateLog updateMany
   */
  export type GateLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GateLogs.
     */
    data: XOR<GateLogUpdateManyMutationInput, GateLogUncheckedUpdateManyInput>
    /**
     * Filter which GateLogs to update
     */
    where?: GateLogWhereInput
    /**
     * Limit how many GateLogs to update.
     */
    limit?: number
  }

  /**
   * GateLog updateManyAndReturn
   */
  export type GateLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GateLog
     */
    select?: GateLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GateLog
     */
    omit?: GateLogOmit<ExtArgs> | null
    /**
     * The data used to update GateLogs.
     */
    data: XOR<GateLogUpdateManyMutationInput, GateLogUncheckedUpdateManyInput>
    /**
     * Filter which GateLogs to update
     */
    where?: GateLogWhereInput
    /**
     * Limit how many GateLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GateLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * GateLog upsert
   */
  export type GateLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GateLog
     */
    select?: GateLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GateLog
     */
    omit?: GateLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GateLogInclude<ExtArgs> | null
    /**
     * The filter to search for the GateLog to update in case it exists.
     */
    where: GateLogWhereUniqueInput
    /**
     * In case the GateLog found by the `where` argument doesn't exist, create a new GateLog with this data.
     */
    create: XOR<GateLogCreateInput, GateLogUncheckedCreateInput>
    /**
     * In case the GateLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GateLogUpdateInput, GateLogUncheckedUpdateInput>
  }

  /**
   * GateLog delete
   */
  export type GateLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GateLog
     */
    select?: GateLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GateLog
     */
    omit?: GateLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GateLogInclude<ExtArgs> | null
    /**
     * Filter which GateLog to delete.
     */
    where: GateLogWhereUniqueInput
  }

  /**
   * GateLog deleteMany
   */
  export type GateLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GateLogs to delete
     */
    where?: GateLogWhereInput
    /**
     * Limit how many GateLogs to delete.
     */
    limit?: number
  }

  /**
   * GateLog without action
   */
  export type GateLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GateLog
     */
    select?: GateLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GateLog
     */
    omit?: GateLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GateLogInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const EstateScalarFieldEnum: {
    id: 'id',
    name: 'name',
    address: 'address',
    totalHouses: 'totalHouses',
    createdAt: 'createdAt',
    settings: 'settings'
  };

  export type EstateScalarFieldEnum = (typeof EstateScalarFieldEnum)[keyof typeof EstateScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password: 'password',
    role: 'role',
    first_login: 'first_login',
    createdAt: 'createdAt',
    estateId: 'estateId'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ResidentScalarFieldEnum: {
    id: 'id',
    first_name: 'first_name',
    last_name: 'last_name',
    email: 'email',
    phone: 'phone',
    dob: 'dob',
    gender: 'gender',
    estateId: 'estateId',
    userId: 'userId',
    status: 'status',
    house_no: 'house_no',
    block: 'block',
    home_address: 'home_address',
    state_of_origin: 'state_of_origin',
    lga: 'lga',
    id_type: 'id_type',
    id_no: 'id_no',
    id_document_front: 'id_document_front',
    id_document_back: 'id_document_back',
    bvn: 'bvn',
    alternate_phone: 'alternate_phone',
    next_of_kin_name: 'next_of_kin_name',
    next_of_kin_phone: 'next_of_kin_phone',
    next_of_kin_email: 'next_of_kin_email',
    next_of_kin_relationship: 'next_of_kin_relationship',
    guarantor_name: 'guarantor_name',
    guarantor_occupation: 'guarantor_occupation',
    guarantor_work_address: 'guarantor_work_address',
    guarantor_id_no: 'guarantor_id_no',
    guarantor_id_relationship: 'guarantor_id_relationship',
    signed_guarantor_letter_upload: 'signed_guarantor_letter_upload',
    vehicle_plate_no: 'vehicle_plate_no',
    vehicle_make: 'vehicle_make',
    vehicle_color: 'vehicle_color',
    proof_of_address_upload: 'proof_of_address_upload',
    passport: 'passport',
    tenancy_ownership_doc: 'tenancy_ownership_doc',
    wallet_pin: 'wallet_pin',
    ndprConsentDataProcessing: 'ndprConsentDataProcessing',
    ndprConsentIdentity: 'ndprConsentIdentity',
    ndprConsentThirdParty: 'ndprConsentThirdParty',
    ndprConsentGivenAt: 'ndprConsentGivenAt',
    approvedAt: 'approvedAt',
    rejectedAt: 'rejectedAt',
    createdAt: 'createdAt'
  };

  export type ResidentScalarFieldEnum = (typeof ResidentScalarFieldEnum)[keyof typeof ResidentScalarFieldEnum]


  export const VisitorScalarFieldEnum: {
    id: 'id',
    estateId: 'estateId',
    residentId: 'residentId',
    name: 'name',
    phone: 'phone',
    status: 'status',
    visitDate: 'visitDate',
    createdAt: 'createdAt'
  };

  export type VisitorScalarFieldEnum = (typeof VisitorScalarFieldEnum)[keyof typeof VisitorScalarFieldEnum]


  export const GateLogScalarFieldEnum: {
    id: 'id',
    visitorId: 'visitorId',
    guardId: 'guardId',
    action: 'action',
    timestamp: 'timestamp'
  };

  export type GateLogScalarFieldEnum = (typeof GateLogScalarFieldEnum)[keyof typeof GateLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'ResidentStatus'
   */
  export type EnumResidentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ResidentStatus'>
    


  /**
   * Reference to a field of type 'ResidentStatus[]'
   */
  export type ListEnumResidentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ResidentStatus[]'>
    


  /**
   * Reference to a field of type 'VisitorStatus'
   */
  export type EnumVisitorStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VisitorStatus'>
    


  /**
   * Reference to a field of type 'VisitorStatus[]'
   */
  export type ListEnumVisitorStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VisitorStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type EstateWhereInput = {
    AND?: EstateWhereInput | EstateWhereInput[]
    OR?: EstateWhereInput[]
    NOT?: EstateWhereInput | EstateWhereInput[]
    id?: StringFilter<"Estate"> | string
    name?: StringFilter<"Estate"> | string
    address?: StringFilter<"Estate"> | string
    totalHouses?: IntFilter<"Estate"> | number
    createdAt?: DateTimeFilter<"Estate"> | Date | string
    settings?: JsonNullableFilter<"Estate">
    residents?: ResidentListRelationFilter
    users?: UserListRelationFilter
    visitors?: VisitorListRelationFilter
  }

  export type EstateOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    totalHouses?: SortOrder
    createdAt?: SortOrder
    settings?: SortOrderInput | SortOrder
    residents?: ResidentOrderByRelationAggregateInput
    users?: UserOrderByRelationAggregateInput
    visitors?: VisitorOrderByRelationAggregateInput
  }

  export type EstateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EstateWhereInput | EstateWhereInput[]
    OR?: EstateWhereInput[]
    NOT?: EstateWhereInput | EstateWhereInput[]
    name?: StringFilter<"Estate"> | string
    address?: StringFilter<"Estate"> | string
    totalHouses?: IntFilter<"Estate"> | number
    createdAt?: DateTimeFilter<"Estate"> | Date | string
    settings?: JsonNullableFilter<"Estate">
    residents?: ResidentListRelationFilter
    users?: UserListRelationFilter
    visitors?: VisitorListRelationFilter
  }, "id">

  export type EstateOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    totalHouses?: SortOrder
    createdAt?: SortOrder
    settings?: SortOrderInput | SortOrder
    _count?: EstateCountOrderByAggregateInput
    _avg?: EstateAvgOrderByAggregateInput
    _max?: EstateMaxOrderByAggregateInput
    _min?: EstateMinOrderByAggregateInput
    _sum?: EstateSumOrderByAggregateInput
  }

  export type EstateScalarWhereWithAggregatesInput = {
    AND?: EstateScalarWhereWithAggregatesInput | EstateScalarWhereWithAggregatesInput[]
    OR?: EstateScalarWhereWithAggregatesInput[]
    NOT?: EstateScalarWhereWithAggregatesInput | EstateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Estate"> | string
    name?: StringWithAggregatesFilter<"Estate"> | string
    address?: StringWithAggregatesFilter<"Estate"> | string
    totalHouses?: IntWithAggregatesFilter<"Estate"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Estate"> | Date | string
    settings?: JsonNullableWithAggregatesFilter<"Estate">
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    first_login?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    estateId?: StringFilter<"User"> | string
    estate?: XOR<EstateScalarRelationFilter, EstateWhereInput>
    resident?: XOR<ResidentNullableScalarRelationFilter, ResidentWhereInput> | null
    gateLogs?: GateLogListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    first_login?: SortOrder
    createdAt?: SortOrder
    estateId?: SortOrder
    estate?: EstateOrderByWithRelationInput
    resident?: ResidentOrderByWithRelationInput
    gateLogs?: GateLogOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    first_login?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    estateId?: StringFilter<"User"> | string
    estate?: XOR<EstateScalarRelationFilter, EstateWhereInput>
    resident?: XOR<ResidentNullableScalarRelationFilter, ResidentWhereInput> | null
    gateLogs?: GateLogListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    first_login?: SortOrder
    createdAt?: SortOrder
    estateId?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    first_login?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    estateId?: StringWithAggregatesFilter<"User"> | string
  }

  export type ResidentWhereInput = {
    AND?: ResidentWhereInput | ResidentWhereInput[]
    OR?: ResidentWhereInput[]
    NOT?: ResidentWhereInput | ResidentWhereInput[]
    id?: StringFilter<"Resident"> | string
    first_name?: StringFilter<"Resident"> | string
    last_name?: StringFilter<"Resident"> | string
    email?: StringFilter<"Resident"> | string
    phone?: StringFilter<"Resident"> | string
    dob?: StringFilter<"Resident"> | string
    gender?: StringFilter<"Resident"> | string
    estateId?: StringFilter<"Resident"> | string
    userId?: StringNullableFilter<"Resident"> | string | null
    status?: EnumResidentStatusFilter<"Resident"> | $Enums.ResidentStatus
    house_no?: StringFilter<"Resident"> | string
    block?: StringFilter<"Resident"> | string
    home_address?: StringFilter<"Resident"> | string
    state_of_origin?: StringFilter<"Resident"> | string
    lga?: StringFilter<"Resident"> | string
    id_type?: StringFilter<"Resident"> | string
    id_no?: StringFilter<"Resident"> | string
    id_document_front?: StringFilter<"Resident"> | string
    id_document_back?: StringFilter<"Resident"> | string
    bvn?: StringNullableFilter<"Resident"> | string | null
    alternate_phone?: StringNullableFilter<"Resident"> | string | null
    next_of_kin_name?: StringNullableFilter<"Resident"> | string | null
    next_of_kin_phone?: StringNullableFilter<"Resident"> | string | null
    next_of_kin_email?: StringNullableFilter<"Resident"> | string | null
    next_of_kin_relationship?: StringNullableFilter<"Resident"> | string | null
    guarantor_name?: StringFilter<"Resident"> | string
    guarantor_occupation?: StringFilter<"Resident"> | string
    guarantor_work_address?: StringFilter<"Resident"> | string
    guarantor_id_no?: StringFilter<"Resident"> | string
    guarantor_id_relationship?: StringFilter<"Resident"> | string
    signed_guarantor_letter_upload?: StringFilter<"Resident"> | string
    vehicle_plate_no?: StringFilter<"Resident"> | string
    vehicle_make?: StringFilter<"Resident"> | string
    vehicle_color?: StringNullableFilter<"Resident"> | string | null
    proof_of_address_upload?: StringFilter<"Resident"> | string
    passport?: StringFilter<"Resident"> | string
    tenancy_ownership_doc?: StringFilter<"Resident"> | string
    wallet_pin?: StringNullableFilter<"Resident"> | string | null
    ndprConsentDataProcessing?: BoolFilter<"Resident"> | boolean
    ndprConsentIdentity?: BoolFilter<"Resident"> | boolean
    ndprConsentThirdParty?: BoolFilter<"Resident"> | boolean
    ndprConsentGivenAt?: DateTimeNullableFilter<"Resident"> | Date | string | null
    approvedAt?: DateTimeNullableFilter<"Resident"> | Date | string | null
    rejectedAt?: DateTimeNullableFilter<"Resident"> | Date | string | null
    createdAt?: DateTimeFilter<"Resident"> | Date | string
    estate?: XOR<EstateScalarRelationFilter, EstateWhereInput>
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    visitors?: VisitorListRelationFilter
  }

  export type ResidentOrderByWithRelationInput = {
    id?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    dob?: SortOrder
    gender?: SortOrder
    estateId?: SortOrder
    userId?: SortOrderInput | SortOrder
    status?: SortOrder
    house_no?: SortOrder
    block?: SortOrder
    home_address?: SortOrder
    state_of_origin?: SortOrder
    lga?: SortOrder
    id_type?: SortOrder
    id_no?: SortOrder
    id_document_front?: SortOrder
    id_document_back?: SortOrder
    bvn?: SortOrderInput | SortOrder
    alternate_phone?: SortOrderInput | SortOrder
    next_of_kin_name?: SortOrderInput | SortOrder
    next_of_kin_phone?: SortOrderInput | SortOrder
    next_of_kin_email?: SortOrderInput | SortOrder
    next_of_kin_relationship?: SortOrderInput | SortOrder
    guarantor_name?: SortOrder
    guarantor_occupation?: SortOrder
    guarantor_work_address?: SortOrder
    guarantor_id_no?: SortOrder
    guarantor_id_relationship?: SortOrder
    signed_guarantor_letter_upload?: SortOrder
    vehicle_plate_no?: SortOrder
    vehicle_make?: SortOrder
    vehicle_color?: SortOrderInput | SortOrder
    proof_of_address_upload?: SortOrder
    passport?: SortOrder
    tenancy_ownership_doc?: SortOrder
    wallet_pin?: SortOrderInput | SortOrder
    ndprConsentDataProcessing?: SortOrder
    ndprConsentIdentity?: SortOrder
    ndprConsentThirdParty?: SortOrder
    ndprConsentGivenAt?: SortOrderInput | SortOrder
    approvedAt?: SortOrderInput | SortOrder
    rejectedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    estate?: EstateOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
    visitors?: VisitorOrderByRelationAggregateInput
  }

  export type ResidentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    userId?: string
    AND?: ResidentWhereInput | ResidentWhereInput[]
    OR?: ResidentWhereInput[]
    NOT?: ResidentWhereInput | ResidentWhereInput[]
    first_name?: StringFilter<"Resident"> | string
    last_name?: StringFilter<"Resident"> | string
    phone?: StringFilter<"Resident"> | string
    dob?: StringFilter<"Resident"> | string
    gender?: StringFilter<"Resident"> | string
    estateId?: StringFilter<"Resident"> | string
    status?: EnumResidentStatusFilter<"Resident"> | $Enums.ResidentStatus
    house_no?: StringFilter<"Resident"> | string
    block?: StringFilter<"Resident"> | string
    home_address?: StringFilter<"Resident"> | string
    state_of_origin?: StringFilter<"Resident"> | string
    lga?: StringFilter<"Resident"> | string
    id_type?: StringFilter<"Resident"> | string
    id_no?: StringFilter<"Resident"> | string
    id_document_front?: StringFilter<"Resident"> | string
    id_document_back?: StringFilter<"Resident"> | string
    bvn?: StringNullableFilter<"Resident"> | string | null
    alternate_phone?: StringNullableFilter<"Resident"> | string | null
    next_of_kin_name?: StringNullableFilter<"Resident"> | string | null
    next_of_kin_phone?: StringNullableFilter<"Resident"> | string | null
    next_of_kin_email?: StringNullableFilter<"Resident"> | string | null
    next_of_kin_relationship?: StringNullableFilter<"Resident"> | string | null
    guarantor_name?: StringFilter<"Resident"> | string
    guarantor_occupation?: StringFilter<"Resident"> | string
    guarantor_work_address?: StringFilter<"Resident"> | string
    guarantor_id_no?: StringFilter<"Resident"> | string
    guarantor_id_relationship?: StringFilter<"Resident"> | string
    signed_guarantor_letter_upload?: StringFilter<"Resident"> | string
    vehicle_plate_no?: StringFilter<"Resident"> | string
    vehicle_make?: StringFilter<"Resident"> | string
    vehicle_color?: StringNullableFilter<"Resident"> | string | null
    proof_of_address_upload?: StringFilter<"Resident"> | string
    passport?: StringFilter<"Resident"> | string
    tenancy_ownership_doc?: StringFilter<"Resident"> | string
    wallet_pin?: StringNullableFilter<"Resident"> | string | null
    ndprConsentDataProcessing?: BoolFilter<"Resident"> | boolean
    ndprConsentIdentity?: BoolFilter<"Resident"> | boolean
    ndprConsentThirdParty?: BoolFilter<"Resident"> | boolean
    ndprConsentGivenAt?: DateTimeNullableFilter<"Resident"> | Date | string | null
    approvedAt?: DateTimeNullableFilter<"Resident"> | Date | string | null
    rejectedAt?: DateTimeNullableFilter<"Resident"> | Date | string | null
    createdAt?: DateTimeFilter<"Resident"> | Date | string
    estate?: XOR<EstateScalarRelationFilter, EstateWhereInput>
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    visitors?: VisitorListRelationFilter
  }, "id" | "email" | "userId">

  export type ResidentOrderByWithAggregationInput = {
    id?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    dob?: SortOrder
    gender?: SortOrder
    estateId?: SortOrder
    userId?: SortOrderInput | SortOrder
    status?: SortOrder
    house_no?: SortOrder
    block?: SortOrder
    home_address?: SortOrder
    state_of_origin?: SortOrder
    lga?: SortOrder
    id_type?: SortOrder
    id_no?: SortOrder
    id_document_front?: SortOrder
    id_document_back?: SortOrder
    bvn?: SortOrderInput | SortOrder
    alternate_phone?: SortOrderInput | SortOrder
    next_of_kin_name?: SortOrderInput | SortOrder
    next_of_kin_phone?: SortOrderInput | SortOrder
    next_of_kin_email?: SortOrderInput | SortOrder
    next_of_kin_relationship?: SortOrderInput | SortOrder
    guarantor_name?: SortOrder
    guarantor_occupation?: SortOrder
    guarantor_work_address?: SortOrder
    guarantor_id_no?: SortOrder
    guarantor_id_relationship?: SortOrder
    signed_guarantor_letter_upload?: SortOrder
    vehicle_plate_no?: SortOrder
    vehicle_make?: SortOrder
    vehicle_color?: SortOrderInput | SortOrder
    proof_of_address_upload?: SortOrder
    passport?: SortOrder
    tenancy_ownership_doc?: SortOrder
    wallet_pin?: SortOrderInput | SortOrder
    ndprConsentDataProcessing?: SortOrder
    ndprConsentIdentity?: SortOrder
    ndprConsentThirdParty?: SortOrder
    ndprConsentGivenAt?: SortOrderInput | SortOrder
    approvedAt?: SortOrderInput | SortOrder
    rejectedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ResidentCountOrderByAggregateInput
    _max?: ResidentMaxOrderByAggregateInput
    _min?: ResidentMinOrderByAggregateInput
  }

  export type ResidentScalarWhereWithAggregatesInput = {
    AND?: ResidentScalarWhereWithAggregatesInput | ResidentScalarWhereWithAggregatesInput[]
    OR?: ResidentScalarWhereWithAggregatesInput[]
    NOT?: ResidentScalarWhereWithAggregatesInput | ResidentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Resident"> | string
    first_name?: StringWithAggregatesFilter<"Resident"> | string
    last_name?: StringWithAggregatesFilter<"Resident"> | string
    email?: StringWithAggregatesFilter<"Resident"> | string
    phone?: StringWithAggregatesFilter<"Resident"> | string
    dob?: StringWithAggregatesFilter<"Resident"> | string
    gender?: StringWithAggregatesFilter<"Resident"> | string
    estateId?: StringWithAggregatesFilter<"Resident"> | string
    userId?: StringNullableWithAggregatesFilter<"Resident"> | string | null
    status?: EnumResidentStatusWithAggregatesFilter<"Resident"> | $Enums.ResidentStatus
    house_no?: StringWithAggregatesFilter<"Resident"> | string
    block?: StringWithAggregatesFilter<"Resident"> | string
    home_address?: StringWithAggregatesFilter<"Resident"> | string
    state_of_origin?: StringWithAggregatesFilter<"Resident"> | string
    lga?: StringWithAggregatesFilter<"Resident"> | string
    id_type?: StringWithAggregatesFilter<"Resident"> | string
    id_no?: StringWithAggregatesFilter<"Resident"> | string
    id_document_front?: StringWithAggregatesFilter<"Resident"> | string
    id_document_back?: StringWithAggregatesFilter<"Resident"> | string
    bvn?: StringNullableWithAggregatesFilter<"Resident"> | string | null
    alternate_phone?: StringNullableWithAggregatesFilter<"Resident"> | string | null
    next_of_kin_name?: StringNullableWithAggregatesFilter<"Resident"> | string | null
    next_of_kin_phone?: StringNullableWithAggregatesFilter<"Resident"> | string | null
    next_of_kin_email?: StringNullableWithAggregatesFilter<"Resident"> | string | null
    next_of_kin_relationship?: StringNullableWithAggregatesFilter<"Resident"> | string | null
    guarantor_name?: StringWithAggregatesFilter<"Resident"> | string
    guarantor_occupation?: StringWithAggregatesFilter<"Resident"> | string
    guarantor_work_address?: StringWithAggregatesFilter<"Resident"> | string
    guarantor_id_no?: StringWithAggregatesFilter<"Resident"> | string
    guarantor_id_relationship?: StringWithAggregatesFilter<"Resident"> | string
    signed_guarantor_letter_upload?: StringWithAggregatesFilter<"Resident"> | string
    vehicle_plate_no?: StringWithAggregatesFilter<"Resident"> | string
    vehicle_make?: StringWithAggregatesFilter<"Resident"> | string
    vehicle_color?: StringNullableWithAggregatesFilter<"Resident"> | string | null
    proof_of_address_upload?: StringWithAggregatesFilter<"Resident"> | string
    passport?: StringWithAggregatesFilter<"Resident"> | string
    tenancy_ownership_doc?: StringWithAggregatesFilter<"Resident"> | string
    wallet_pin?: StringNullableWithAggregatesFilter<"Resident"> | string | null
    ndprConsentDataProcessing?: BoolWithAggregatesFilter<"Resident"> | boolean
    ndprConsentIdentity?: BoolWithAggregatesFilter<"Resident"> | boolean
    ndprConsentThirdParty?: BoolWithAggregatesFilter<"Resident"> | boolean
    ndprConsentGivenAt?: DateTimeNullableWithAggregatesFilter<"Resident"> | Date | string | null
    approvedAt?: DateTimeNullableWithAggregatesFilter<"Resident"> | Date | string | null
    rejectedAt?: DateTimeNullableWithAggregatesFilter<"Resident"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Resident"> | Date | string
  }

  export type VisitorWhereInput = {
    AND?: VisitorWhereInput | VisitorWhereInput[]
    OR?: VisitorWhereInput[]
    NOT?: VisitorWhereInput | VisitorWhereInput[]
    id?: StringFilter<"Visitor"> | string
    estateId?: StringFilter<"Visitor"> | string
    residentId?: StringFilter<"Visitor"> | string
    name?: StringFilter<"Visitor"> | string
    phone?: StringNullableFilter<"Visitor"> | string | null
    status?: EnumVisitorStatusFilter<"Visitor"> | $Enums.VisitorStatus
    visitDate?: DateTimeFilter<"Visitor"> | Date | string
    createdAt?: DateTimeFilter<"Visitor"> | Date | string
    estate?: XOR<EstateScalarRelationFilter, EstateWhereInput>
    resident?: XOR<ResidentScalarRelationFilter, ResidentWhereInput>
    gateLogs?: GateLogListRelationFilter
  }

  export type VisitorOrderByWithRelationInput = {
    id?: SortOrder
    estateId?: SortOrder
    residentId?: SortOrder
    name?: SortOrder
    phone?: SortOrderInput | SortOrder
    status?: SortOrder
    visitDate?: SortOrder
    createdAt?: SortOrder
    estate?: EstateOrderByWithRelationInput
    resident?: ResidentOrderByWithRelationInput
    gateLogs?: GateLogOrderByRelationAggregateInput
  }

  export type VisitorWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VisitorWhereInput | VisitorWhereInput[]
    OR?: VisitorWhereInput[]
    NOT?: VisitorWhereInput | VisitorWhereInput[]
    estateId?: StringFilter<"Visitor"> | string
    residentId?: StringFilter<"Visitor"> | string
    name?: StringFilter<"Visitor"> | string
    phone?: StringNullableFilter<"Visitor"> | string | null
    status?: EnumVisitorStatusFilter<"Visitor"> | $Enums.VisitorStatus
    visitDate?: DateTimeFilter<"Visitor"> | Date | string
    createdAt?: DateTimeFilter<"Visitor"> | Date | string
    estate?: XOR<EstateScalarRelationFilter, EstateWhereInput>
    resident?: XOR<ResidentScalarRelationFilter, ResidentWhereInput>
    gateLogs?: GateLogListRelationFilter
  }, "id">

  export type VisitorOrderByWithAggregationInput = {
    id?: SortOrder
    estateId?: SortOrder
    residentId?: SortOrder
    name?: SortOrder
    phone?: SortOrderInput | SortOrder
    status?: SortOrder
    visitDate?: SortOrder
    createdAt?: SortOrder
    _count?: VisitorCountOrderByAggregateInput
    _max?: VisitorMaxOrderByAggregateInput
    _min?: VisitorMinOrderByAggregateInput
  }

  export type VisitorScalarWhereWithAggregatesInput = {
    AND?: VisitorScalarWhereWithAggregatesInput | VisitorScalarWhereWithAggregatesInput[]
    OR?: VisitorScalarWhereWithAggregatesInput[]
    NOT?: VisitorScalarWhereWithAggregatesInput | VisitorScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Visitor"> | string
    estateId?: StringWithAggregatesFilter<"Visitor"> | string
    residentId?: StringWithAggregatesFilter<"Visitor"> | string
    name?: StringWithAggregatesFilter<"Visitor"> | string
    phone?: StringNullableWithAggregatesFilter<"Visitor"> | string | null
    status?: EnumVisitorStatusWithAggregatesFilter<"Visitor"> | $Enums.VisitorStatus
    visitDate?: DateTimeWithAggregatesFilter<"Visitor"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Visitor"> | Date | string
  }

  export type GateLogWhereInput = {
    AND?: GateLogWhereInput | GateLogWhereInput[]
    OR?: GateLogWhereInput[]
    NOT?: GateLogWhereInput | GateLogWhereInput[]
    id?: StringFilter<"GateLog"> | string
    visitorId?: StringFilter<"GateLog"> | string
    guardId?: StringFilter<"GateLog"> | string
    action?: StringFilter<"GateLog"> | string
    timestamp?: DateTimeFilter<"GateLog"> | Date | string
    guard?: XOR<UserScalarRelationFilter, UserWhereInput>
    visitor?: XOR<VisitorScalarRelationFilter, VisitorWhereInput>
  }

  export type GateLogOrderByWithRelationInput = {
    id?: SortOrder
    visitorId?: SortOrder
    guardId?: SortOrder
    action?: SortOrder
    timestamp?: SortOrder
    guard?: UserOrderByWithRelationInput
    visitor?: VisitorOrderByWithRelationInput
  }

  export type GateLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GateLogWhereInput | GateLogWhereInput[]
    OR?: GateLogWhereInput[]
    NOT?: GateLogWhereInput | GateLogWhereInput[]
    visitorId?: StringFilter<"GateLog"> | string
    guardId?: StringFilter<"GateLog"> | string
    action?: StringFilter<"GateLog"> | string
    timestamp?: DateTimeFilter<"GateLog"> | Date | string
    guard?: XOR<UserScalarRelationFilter, UserWhereInput>
    visitor?: XOR<VisitorScalarRelationFilter, VisitorWhereInput>
  }, "id">

  export type GateLogOrderByWithAggregationInput = {
    id?: SortOrder
    visitorId?: SortOrder
    guardId?: SortOrder
    action?: SortOrder
    timestamp?: SortOrder
    _count?: GateLogCountOrderByAggregateInput
    _max?: GateLogMaxOrderByAggregateInput
    _min?: GateLogMinOrderByAggregateInput
  }

  export type GateLogScalarWhereWithAggregatesInput = {
    AND?: GateLogScalarWhereWithAggregatesInput | GateLogScalarWhereWithAggregatesInput[]
    OR?: GateLogScalarWhereWithAggregatesInput[]
    NOT?: GateLogScalarWhereWithAggregatesInput | GateLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GateLog"> | string
    visitorId?: StringWithAggregatesFilter<"GateLog"> | string
    guardId?: StringWithAggregatesFilter<"GateLog"> | string
    action?: StringWithAggregatesFilter<"GateLog"> | string
    timestamp?: DateTimeWithAggregatesFilter<"GateLog"> | Date | string
  }

  export type EstateCreateInput = {
    id?: string
    name: string
    address: string
    totalHouses: number
    createdAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    residents?: ResidentCreateNestedManyWithoutEstateInput
    users?: UserCreateNestedManyWithoutEstateInput
    visitors?: VisitorCreateNestedManyWithoutEstateInput
  }

  export type EstateUncheckedCreateInput = {
    id?: string
    name: string
    address: string
    totalHouses: number
    createdAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    residents?: ResidentUncheckedCreateNestedManyWithoutEstateInput
    users?: UserUncheckedCreateNestedManyWithoutEstateInput
    visitors?: VisitorUncheckedCreateNestedManyWithoutEstateInput
  }

  export type EstateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    totalHouses?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    residents?: ResidentUpdateManyWithoutEstateNestedInput
    users?: UserUpdateManyWithoutEstateNestedInput
    visitors?: VisitorUpdateManyWithoutEstateNestedInput
  }

  export type EstateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    totalHouses?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    residents?: ResidentUncheckedUpdateManyWithoutEstateNestedInput
    users?: UserUncheckedUpdateManyWithoutEstateNestedInput
    visitors?: VisitorUncheckedUpdateManyWithoutEstateNestedInput
  }

  export type EstateCreateManyInput = {
    id?: string
    name: string
    address: string
    totalHouses: number
    createdAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
  }

  export type EstateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    totalHouses?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
  }

  export type EstateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    totalHouses?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
  }

  export type UserCreateInput = {
    id?: string
    email: string
    password: string
    role: $Enums.Role
    first_login?: boolean
    createdAt?: Date | string
    estate: EstateCreateNestedOneWithoutUsersInput
    resident?: ResidentCreateNestedOneWithoutUserInput
    gateLogs?: GateLogCreateNestedManyWithoutGuardInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    password: string
    role: $Enums.Role
    first_login?: boolean
    createdAt?: Date | string
    estateId: string
    resident?: ResidentUncheckedCreateNestedOneWithoutUserInput
    gateLogs?: GateLogUncheckedCreateNestedManyWithoutGuardInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    first_login?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    estate?: EstateUpdateOneRequiredWithoutUsersNestedInput
    resident?: ResidentUpdateOneWithoutUserNestedInput
    gateLogs?: GateLogUpdateManyWithoutGuardNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    first_login?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    estateId?: StringFieldUpdateOperationsInput | string
    resident?: ResidentUncheckedUpdateOneWithoutUserNestedInput
    gateLogs?: GateLogUncheckedUpdateManyWithoutGuardNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    password: string
    role: $Enums.Role
    first_login?: boolean
    createdAt?: Date | string
    estateId: string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    first_login?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    first_login?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    estateId?: StringFieldUpdateOperationsInput | string
  }

  export type ResidentCreateInput = {
    id?: string
    first_name: string
    last_name: string
    email: string
    phone: string
    dob: string
    gender: string
    status?: $Enums.ResidentStatus
    house_no: string
    block: string
    home_address: string
    state_of_origin: string
    lga: string
    id_type: string
    id_no: string
    id_document_front: string
    id_document_back: string
    bvn?: string | null
    alternate_phone?: string | null
    next_of_kin_name?: string | null
    next_of_kin_phone?: string | null
    next_of_kin_email?: string | null
    next_of_kin_relationship?: string | null
    guarantor_name: string
    guarantor_occupation: string
    guarantor_work_address: string
    guarantor_id_no: string
    guarantor_id_relationship: string
    signed_guarantor_letter_upload: string
    vehicle_plate_no: string
    vehicle_make: string
    vehicle_color?: string | null
    proof_of_address_upload: string
    passport: string
    tenancy_ownership_doc: string
    wallet_pin?: string | null
    ndprConsentDataProcessing: boolean
    ndprConsentIdentity: boolean
    ndprConsentThirdParty: boolean
    ndprConsentGivenAt?: Date | string | null
    approvedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    estate: EstateCreateNestedOneWithoutResidentsInput
    user?: UserCreateNestedOneWithoutResidentInput
    visitors?: VisitorCreateNestedManyWithoutResidentInput
  }

  export type ResidentUncheckedCreateInput = {
    id?: string
    first_name: string
    last_name: string
    email: string
    phone: string
    dob: string
    gender: string
    estateId: string
    userId?: string | null
    status?: $Enums.ResidentStatus
    house_no: string
    block: string
    home_address: string
    state_of_origin: string
    lga: string
    id_type: string
    id_no: string
    id_document_front: string
    id_document_back: string
    bvn?: string | null
    alternate_phone?: string | null
    next_of_kin_name?: string | null
    next_of_kin_phone?: string | null
    next_of_kin_email?: string | null
    next_of_kin_relationship?: string | null
    guarantor_name: string
    guarantor_occupation: string
    guarantor_work_address: string
    guarantor_id_no: string
    guarantor_id_relationship: string
    signed_guarantor_letter_upload: string
    vehicle_plate_no: string
    vehicle_make: string
    vehicle_color?: string | null
    proof_of_address_upload: string
    passport: string
    tenancy_ownership_doc: string
    wallet_pin?: string | null
    ndprConsentDataProcessing: boolean
    ndprConsentIdentity: boolean
    ndprConsentThirdParty: boolean
    ndprConsentGivenAt?: Date | string | null
    approvedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    visitors?: VisitorUncheckedCreateNestedManyWithoutResidentInput
  }

  export type ResidentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    dob?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    status?: EnumResidentStatusFieldUpdateOperationsInput | $Enums.ResidentStatus
    house_no?: StringFieldUpdateOperationsInput | string
    block?: StringFieldUpdateOperationsInput | string
    home_address?: StringFieldUpdateOperationsInput | string
    state_of_origin?: StringFieldUpdateOperationsInput | string
    lga?: StringFieldUpdateOperationsInput | string
    id_type?: StringFieldUpdateOperationsInput | string
    id_no?: StringFieldUpdateOperationsInput | string
    id_document_front?: StringFieldUpdateOperationsInput | string
    id_document_back?: StringFieldUpdateOperationsInput | string
    bvn?: NullableStringFieldUpdateOperationsInput | string | null
    alternate_phone?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_name?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_phone?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_email?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_relationship?: NullableStringFieldUpdateOperationsInput | string | null
    guarantor_name?: StringFieldUpdateOperationsInput | string
    guarantor_occupation?: StringFieldUpdateOperationsInput | string
    guarantor_work_address?: StringFieldUpdateOperationsInput | string
    guarantor_id_no?: StringFieldUpdateOperationsInput | string
    guarantor_id_relationship?: StringFieldUpdateOperationsInput | string
    signed_guarantor_letter_upload?: StringFieldUpdateOperationsInput | string
    vehicle_plate_no?: StringFieldUpdateOperationsInput | string
    vehicle_make?: StringFieldUpdateOperationsInput | string
    vehicle_color?: NullableStringFieldUpdateOperationsInput | string | null
    proof_of_address_upload?: StringFieldUpdateOperationsInput | string
    passport?: StringFieldUpdateOperationsInput | string
    tenancy_ownership_doc?: StringFieldUpdateOperationsInput | string
    wallet_pin?: NullableStringFieldUpdateOperationsInput | string | null
    ndprConsentDataProcessing?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentIdentity?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentThirdParty?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentGivenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    estate?: EstateUpdateOneRequiredWithoutResidentsNestedInput
    user?: UserUpdateOneWithoutResidentNestedInput
    visitors?: VisitorUpdateManyWithoutResidentNestedInput
  }

  export type ResidentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    dob?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    estateId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumResidentStatusFieldUpdateOperationsInput | $Enums.ResidentStatus
    house_no?: StringFieldUpdateOperationsInput | string
    block?: StringFieldUpdateOperationsInput | string
    home_address?: StringFieldUpdateOperationsInput | string
    state_of_origin?: StringFieldUpdateOperationsInput | string
    lga?: StringFieldUpdateOperationsInput | string
    id_type?: StringFieldUpdateOperationsInput | string
    id_no?: StringFieldUpdateOperationsInput | string
    id_document_front?: StringFieldUpdateOperationsInput | string
    id_document_back?: StringFieldUpdateOperationsInput | string
    bvn?: NullableStringFieldUpdateOperationsInput | string | null
    alternate_phone?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_name?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_phone?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_email?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_relationship?: NullableStringFieldUpdateOperationsInput | string | null
    guarantor_name?: StringFieldUpdateOperationsInput | string
    guarantor_occupation?: StringFieldUpdateOperationsInput | string
    guarantor_work_address?: StringFieldUpdateOperationsInput | string
    guarantor_id_no?: StringFieldUpdateOperationsInput | string
    guarantor_id_relationship?: StringFieldUpdateOperationsInput | string
    signed_guarantor_letter_upload?: StringFieldUpdateOperationsInput | string
    vehicle_plate_no?: StringFieldUpdateOperationsInput | string
    vehicle_make?: StringFieldUpdateOperationsInput | string
    vehicle_color?: NullableStringFieldUpdateOperationsInput | string | null
    proof_of_address_upload?: StringFieldUpdateOperationsInput | string
    passport?: StringFieldUpdateOperationsInput | string
    tenancy_ownership_doc?: StringFieldUpdateOperationsInput | string
    wallet_pin?: NullableStringFieldUpdateOperationsInput | string | null
    ndprConsentDataProcessing?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentIdentity?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentThirdParty?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentGivenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    visitors?: VisitorUncheckedUpdateManyWithoutResidentNestedInput
  }

  export type ResidentCreateManyInput = {
    id?: string
    first_name: string
    last_name: string
    email: string
    phone: string
    dob: string
    gender: string
    estateId: string
    userId?: string | null
    status?: $Enums.ResidentStatus
    house_no: string
    block: string
    home_address: string
    state_of_origin: string
    lga: string
    id_type: string
    id_no: string
    id_document_front: string
    id_document_back: string
    bvn?: string | null
    alternate_phone?: string | null
    next_of_kin_name?: string | null
    next_of_kin_phone?: string | null
    next_of_kin_email?: string | null
    next_of_kin_relationship?: string | null
    guarantor_name: string
    guarantor_occupation: string
    guarantor_work_address: string
    guarantor_id_no: string
    guarantor_id_relationship: string
    signed_guarantor_letter_upload: string
    vehicle_plate_no: string
    vehicle_make: string
    vehicle_color?: string | null
    proof_of_address_upload: string
    passport: string
    tenancy_ownership_doc: string
    wallet_pin?: string | null
    ndprConsentDataProcessing: boolean
    ndprConsentIdentity: boolean
    ndprConsentThirdParty: boolean
    ndprConsentGivenAt?: Date | string | null
    approvedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type ResidentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    dob?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    status?: EnumResidentStatusFieldUpdateOperationsInput | $Enums.ResidentStatus
    house_no?: StringFieldUpdateOperationsInput | string
    block?: StringFieldUpdateOperationsInput | string
    home_address?: StringFieldUpdateOperationsInput | string
    state_of_origin?: StringFieldUpdateOperationsInput | string
    lga?: StringFieldUpdateOperationsInput | string
    id_type?: StringFieldUpdateOperationsInput | string
    id_no?: StringFieldUpdateOperationsInput | string
    id_document_front?: StringFieldUpdateOperationsInput | string
    id_document_back?: StringFieldUpdateOperationsInput | string
    bvn?: NullableStringFieldUpdateOperationsInput | string | null
    alternate_phone?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_name?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_phone?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_email?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_relationship?: NullableStringFieldUpdateOperationsInput | string | null
    guarantor_name?: StringFieldUpdateOperationsInput | string
    guarantor_occupation?: StringFieldUpdateOperationsInput | string
    guarantor_work_address?: StringFieldUpdateOperationsInput | string
    guarantor_id_no?: StringFieldUpdateOperationsInput | string
    guarantor_id_relationship?: StringFieldUpdateOperationsInput | string
    signed_guarantor_letter_upload?: StringFieldUpdateOperationsInput | string
    vehicle_plate_no?: StringFieldUpdateOperationsInput | string
    vehicle_make?: StringFieldUpdateOperationsInput | string
    vehicle_color?: NullableStringFieldUpdateOperationsInput | string | null
    proof_of_address_upload?: StringFieldUpdateOperationsInput | string
    passport?: StringFieldUpdateOperationsInput | string
    tenancy_ownership_doc?: StringFieldUpdateOperationsInput | string
    wallet_pin?: NullableStringFieldUpdateOperationsInput | string | null
    ndprConsentDataProcessing?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentIdentity?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentThirdParty?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentGivenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResidentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    dob?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    estateId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumResidentStatusFieldUpdateOperationsInput | $Enums.ResidentStatus
    house_no?: StringFieldUpdateOperationsInput | string
    block?: StringFieldUpdateOperationsInput | string
    home_address?: StringFieldUpdateOperationsInput | string
    state_of_origin?: StringFieldUpdateOperationsInput | string
    lga?: StringFieldUpdateOperationsInput | string
    id_type?: StringFieldUpdateOperationsInput | string
    id_no?: StringFieldUpdateOperationsInput | string
    id_document_front?: StringFieldUpdateOperationsInput | string
    id_document_back?: StringFieldUpdateOperationsInput | string
    bvn?: NullableStringFieldUpdateOperationsInput | string | null
    alternate_phone?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_name?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_phone?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_email?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_relationship?: NullableStringFieldUpdateOperationsInput | string | null
    guarantor_name?: StringFieldUpdateOperationsInput | string
    guarantor_occupation?: StringFieldUpdateOperationsInput | string
    guarantor_work_address?: StringFieldUpdateOperationsInput | string
    guarantor_id_no?: StringFieldUpdateOperationsInput | string
    guarantor_id_relationship?: StringFieldUpdateOperationsInput | string
    signed_guarantor_letter_upload?: StringFieldUpdateOperationsInput | string
    vehicle_plate_no?: StringFieldUpdateOperationsInput | string
    vehicle_make?: StringFieldUpdateOperationsInput | string
    vehicle_color?: NullableStringFieldUpdateOperationsInput | string | null
    proof_of_address_upload?: StringFieldUpdateOperationsInput | string
    passport?: StringFieldUpdateOperationsInput | string
    tenancy_ownership_doc?: StringFieldUpdateOperationsInput | string
    wallet_pin?: NullableStringFieldUpdateOperationsInput | string | null
    ndprConsentDataProcessing?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentIdentity?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentThirdParty?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentGivenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VisitorCreateInput = {
    id?: string
    name: string
    phone?: string | null
    status?: $Enums.VisitorStatus
    visitDate: Date | string
    createdAt?: Date | string
    estate: EstateCreateNestedOneWithoutVisitorsInput
    resident: ResidentCreateNestedOneWithoutVisitorsInput
    gateLogs?: GateLogCreateNestedManyWithoutVisitorInput
  }

  export type VisitorUncheckedCreateInput = {
    id?: string
    estateId: string
    residentId: string
    name: string
    phone?: string | null
    status?: $Enums.VisitorStatus
    visitDate: Date | string
    createdAt?: Date | string
    gateLogs?: GateLogUncheckedCreateNestedManyWithoutVisitorInput
  }

  export type VisitorUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumVisitorStatusFieldUpdateOperationsInput | $Enums.VisitorStatus
    visitDate?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    estate?: EstateUpdateOneRequiredWithoutVisitorsNestedInput
    resident?: ResidentUpdateOneRequiredWithoutVisitorsNestedInput
    gateLogs?: GateLogUpdateManyWithoutVisitorNestedInput
  }

  export type VisitorUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    estateId?: StringFieldUpdateOperationsInput | string
    residentId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumVisitorStatusFieldUpdateOperationsInput | $Enums.VisitorStatus
    visitDate?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gateLogs?: GateLogUncheckedUpdateManyWithoutVisitorNestedInput
  }

  export type VisitorCreateManyInput = {
    id?: string
    estateId: string
    residentId: string
    name: string
    phone?: string | null
    status?: $Enums.VisitorStatus
    visitDate: Date | string
    createdAt?: Date | string
  }

  export type VisitorUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumVisitorStatusFieldUpdateOperationsInput | $Enums.VisitorStatus
    visitDate?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VisitorUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    estateId?: StringFieldUpdateOperationsInput | string
    residentId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumVisitorStatusFieldUpdateOperationsInput | $Enums.VisitorStatus
    visitDate?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GateLogCreateInput = {
    id?: string
    action: string
    timestamp?: Date | string
    guard: UserCreateNestedOneWithoutGateLogsInput
    visitor: VisitorCreateNestedOneWithoutGateLogsInput
  }

  export type GateLogUncheckedCreateInput = {
    id?: string
    visitorId: string
    guardId: string
    action: string
    timestamp?: Date | string
  }

  export type GateLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    guard?: UserUpdateOneRequiredWithoutGateLogsNestedInput
    visitor?: VisitorUpdateOneRequiredWithoutGateLogsNestedInput
  }

  export type GateLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitorId?: StringFieldUpdateOperationsInput | string
    guardId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GateLogCreateManyInput = {
    id?: string
    visitorId: string
    guardId: string
    action: string
    timestamp?: Date | string
  }

  export type GateLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GateLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitorId?: StringFieldUpdateOperationsInput | string
    guardId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ResidentListRelationFilter = {
    every?: ResidentWhereInput
    some?: ResidentWhereInput
    none?: ResidentWhereInput
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type VisitorListRelationFilter = {
    every?: VisitorWhereInput
    some?: VisitorWhereInput
    none?: VisitorWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ResidentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VisitorOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EstateCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    totalHouses?: SortOrder
    createdAt?: SortOrder
    settings?: SortOrder
  }

  export type EstateAvgOrderByAggregateInput = {
    totalHouses?: SortOrder
  }

  export type EstateMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    totalHouses?: SortOrder
    createdAt?: SortOrder
  }

  export type EstateMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    totalHouses?: SortOrder
    createdAt?: SortOrder
  }

  export type EstateSumOrderByAggregateInput = {
    totalHouses?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type EstateScalarRelationFilter = {
    is?: EstateWhereInput
    isNot?: EstateWhereInput
  }

  export type ResidentNullableScalarRelationFilter = {
    is?: ResidentWhereInput | null
    isNot?: ResidentWhereInput | null
  }

  export type GateLogListRelationFilter = {
    every?: GateLogWhereInput
    some?: GateLogWhereInput
    none?: GateLogWhereInput
  }

  export type GateLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    first_login?: SortOrder
    createdAt?: SortOrder
    estateId?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    first_login?: SortOrder
    createdAt?: SortOrder
    estateId?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    first_login?: SortOrder
    createdAt?: SortOrder
    estateId?: SortOrder
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumResidentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ResidentStatus | EnumResidentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ResidentStatus[] | ListEnumResidentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ResidentStatus[] | ListEnumResidentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumResidentStatusFilter<$PrismaModel> | $Enums.ResidentStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type ResidentCountOrderByAggregateInput = {
    id?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    dob?: SortOrder
    gender?: SortOrder
    estateId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    house_no?: SortOrder
    block?: SortOrder
    home_address?: SortOrder
    state_of_origin?: SortOrder
    lga?: SortOrder
    id_type?: SortOrder
    id_no?: SortOrder
    id_document_front?: SortOrder
    id_document_back?: SortOrder
    bvn?: SortOrder
    alternate_phone?: SortOrder
    next_of_kin_name?: SortOrder
    next_of_kin_phone?: SortOrder
    next_of_kin_email?: SortOrder
    next_of_kin_relationship?: SortOrder
    guarantor_name?: SortOrder
    guarantor_occupation?: SortOrder
    guarantor_work_address?: SortOrder
    guarantor_id_no?: SortOrder
    guarantor_id_relationship?: SortOrder
    signed_guarantor_letter_upload?: SortOrder
    vehicle_plate_no?: SortOrder
    vehicle_make?: SortOrder
    vehicle_color?: SortOrder
    proof_of_address_upload?: SortOrder
    passport?: SortOrder
    tenancy_ownership_doc?: SortOrder
    wallet_pin?: SortOrder
    ndprConsentDataProcessing?: SortOrder
    ndprConsentIdentity?: SortOrder
    ndprConsentThirdParty?: SortOrder
    ndprConsentGivenAt?: SortOrder
    approvedAt?: SortOrder
    rejectedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type ResidentMaxOrderByAggregateInput = {
    id?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    dob?: SortOrder
    gender?: SortOrder
    estateId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    house_no?: SortOrder
    block?: SortOrder
    home_address?: SortOrder
    state_of_origin?: SortOrder
    lga?: SortOrder
    id_type?: SortOrder
    id_no?: SortOrder
    id_document_front?: SortOrder
    id_document_back?: SortOrder
    bvn?: SortOrder
    alternate_phone?: SortOrder
    next_of_kin_name?: SortOrder
    next_of_kin_phone?: SortOrder
    next_of_kin_email?: SortOrder
    next_of_kin_relationship?: SortOrder
    guarantor_name?: SortOrder
    guarantor_occupation?: SortOrder
    guarantor_work_address?: SortOrder
    guarantor_id_no?: SortOrder
    guarantor_id_relationship?: SortOrder
    signed_guarantor_letter_upload?: SortOrder
    vehicle_plate_no?: SortOrder
    vehicle_make?: SortOrder
    vehicle_color?: SortOrder
    proof_of_address_upload?: SortOrder
    passport?: SortOrder
    tenancy_ownership_doc?: SortOrder
    wallet_pin?: SortOrder
    ndprConsentDataProcessing?: SortOrder
    ndprConsentIdentity?: SortOrder
    ndprConsentThirdParty?: SortOrder
    ndprConsentGivenAt?: SortOrder
    approvedAt?: SortOrder
    rejectedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type ResidentMinOrderByAggregateInput = {
    id?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    dob?: SortOrder
    gender?: SortOrder
    estateId?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    house_no?: SortOrder
    block?: SortOrder
    home_address?: SortOrder
    state_of_origin?: SortOrder
    lga?: SortOrder
    id_type?: SortOrder
    id_no?: SortOrder
    id_document_front?: SortOrder
    id_document_back?: SortOrder
    bvn?: SortOrder
    alternate_phone?: SortOrder
    next_of_kin_name?: SortOrder
    next_of_kin_phone?: SortOrder
    next_of_kin_email?: SortOrder
    next_of_kin_relationship?: SortOrder
    guarantor_name?: SortOrder
    guarantor_occupation?: SortOrder
    guarantor_work_address?: SortOrder
    guarantor_id_no?: SortOrder
    guarantor_id_relationship?: SortOrder
    signed_guarantor_letter_upload?: SortOrder
    vehicle_plate_no?: SortOrder
    vehicle_make?: SortOrder
    vehicle_color?: SortOrder
    proof_of_address_upload?: SortOrder
    passport?: SortOrder
    tenancy_ownership_doc?: SortOrder
    wallet_pin?: SortOrder
    ndprConsentDataProcessing?: SortOrder
    ndprConsentIdentity?: SortOrder
    ndprConsentThirdParty?: SortOrder
    ndprConsentGivenAt?: SortOrder
    approvedAt?: SortOrder
    rejectedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumResidentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ResidentStatus | EnumResidentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ResidentStatus[] | ListEnumResidentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ResidentStatus[] | ListEnumResidentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumResidentStatusWithAggregatesFilter<$PrismaModel> | $Enums.ResidentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumResidentStatusFilter<$PrismaModel>
    _max?: NestedEnumResidentStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumVisitorStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.VisitorStatus | EnumVisitorStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VisitorStatus[] | ListEnumVisitorStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VisitorStatus[] | ListEnumVisitorStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVisitorStatusFilter<$PrismaModel> | $Enums.VisitorStatus
  }

  export type ResidentScalarRelationFilter = {
    is?: ResidentWhereInput
    isNot?: ResidentWhereInput
  }

  export type VisitorCountOrderByAggregateInput = {
    id?: SortOrder
    estateId?: SortOrder
    residentId?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    status?: SortOrder
    visitDate?: SortOrder
    createdAt?: SortOrder
  }

  export type VisitorMaxOrderByAggregateInput = {
    id?: SortOrder
    estateId?: SortOrder
    residentId?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    status?: SortOrder
    visitDate?: SortOrder
    createdAt?: SortOrder
  }

  export type VisitorMinOrderByAggregateInput = {
    id?: SortOrder
    estateId?: SortOrder
    residentId?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    status?: SortOrder
    visitDate?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumVisitorStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VisitorStatus | EnumVisitorStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VisitorStatus[] | ListEnumVisitorStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VisitorStatus[] | ListEnumVisitorStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVisitorStatusWithAggregatesFilter<$PrismaModel> | $Enums.VisitorStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVisitorStatusFilter<$PrismaModel>
    _max?: NestedEnumVisitorStatusFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type VisitorScalarRelationFilter = {
    is?: VisitorWhereInput
    isNot?: VisitorWhereInput
  }

  export type GateLogCountOrderByAggregateInput = {
    id?: SortOrder
    visitorId?: SortOrder
    guardId?: SortOrder
    action?: SortOrder
    timestamp?: SortOrder
  }

  export type GateLogMaxOrderByAggregateInput = {
    id?: SortOrder
    visitorId?: SortOrder
    guardId?: SortOrder
    action?: SortOrder
    timestamp?: SortOrder
  }

  export type GateLogMinOrderByAggregateInput = {
    id?: SortOrder
    visitorId?: SortOrder
    guardId?: SortOrder
    action?: SortOrder
    timestamp?: SortOrder
  }

  export type ResidentCreateNestedManyWithoutEstateInput = {
    create?: XOR<ResidentCreateWithoutEstateInput, ResidentUncheckedCreateWithoutEstateInput> | ResidentCreateWithoutEstateInput[] | ResidentUncheckedCreateWithoutEstateInput[]
    connectOrCreate?: ResidentCreateOrConnectWithoutEstateInput | ResidentCreateOrConnectWithoutEstateInput[]
    createMany?: ResidentCreateManyEstateInputEnvelope
    connect?: ResidentWhereUniqueInput | ResidentWhereUniqueInput[]
  }

  export type UserCreateNestedManyWithoutEstateInput = {
    create?: XOR<UserCreateWithoutEstateInput, UserUncheckedCreateWithoutEstateInput> | UserCreateWithoutEstateInput[] | UserUncheckedCreateWithoutEstateInput[]
    connectOrCreate?: UserCreateOrConnectWithoutEstateInput | UserCreateOrConnectWithoutEstateInput[]
    createMany?: UserCreateManyEstateInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type VisitorCreateNestedManyWithoutEstateInput = {
    create?: XOR<VisitorCreateWithoutEstateInput, VisitorUncheckedCreateWithoutEstateInput> | VisitorCreateWithoutEstateInput[] | VisitorUncheckedCreateWithoutEstateInput[]
    connectOrCreate?: VisitorCreateOrConnectWithoutEstateInput | VisitorCreateOrConnectWithoutEstateInput[]
    createMany?: VisitorCreateManyEstateInputEnvelope
    connect?: VisitorWhereUniqueInput | VisitorWhereUniqueInput[]
  }

  export type ResidentUncheckedCreateNestedManyWithoutEstateInput = {
    create?: XOR<ResidentCreateWithoutEstateInput, ResidentUncheckedCreateWithoutEstateInput> | ResidentCreateWithoutEstateInput[] | ResidentUncheckedCreateWithoutEstateInput[]
    connectOrCreate?: ResidentCreateOrConnectWithoutEstateInput | ResidentCreateOrConnectWithoutEstateInput[]
    createMany?: ResidentCreateManyEstateInputEnvelope
    connect?: ResidentWhereUniqueInput | ResidentWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutEstateInput = {
    create?: XOR<UserCreateWithoutEstateInput, UserUncheckedCreateWithoutEstateInput> | UserCreateWithoutEstateInput[] | UserUncheckedCreateWithoutEstateInput[]
    connectOrCreate?: UserCreateOrConnectWithoutEstateInput | UserCreateOrConnectWithoutEstateInput[]
    createMany?: UserCreateManyEstateInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type VisitorUncheckedCreateNestedManyWithoutEstateInput = {
    create?: XOR<VisitorCreateWithoutEstateInput, VisitorUncheckedCreateWithoutEstateInput> | VisitorCreateWithoutEstateInput[] | VisitorUncheckedCreateWithoutEstateInput[]
    connectOrCreate?: VisitorCreateOrConnectWithoutEstateInput | VisitorCreateOrConnectWithoutEstateInput[]
    createMany?: VisitorCreateManyEstateInputEnvelope
    connect?: VisitorWhereUniqueInput | VisitorWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ResidentUpdateManyWithoutEstateNestedInput = {
    create?: XOR<ResidentCreateWithoutEstateInput, ResidentUncheckedCreateWithoutEstateInput> | ResidentCreateWithoutEstateInput[] | ResidentUncheckedCreateWithoutEstateInput[]
    connectOrCreate?: ResidentCreateOrConnectWithoutEstateInput | ResidentCreateOrConnectWithoutEstateInput[]
    upsert?: ResidentUpsertWithWhereUniqueWithoutEstateInput | ResidentUpsertWithWhereUniqueWithoutEstateInput[]
    createMany?: ResidentCreateManyEstateInputEnvelope
    set?: ResidentWhereUniqueInput | ResidentWhereUniqueInput[]
    disconnect?: ResidentWhereUniqueInput | ResidentWhereUniqueInput[]
    delete?: ResidentWhereUniqueInput | ResidentWhereUniqueInput[]
    connect?: ResidentWhereUniqueInput | ResidentWhereUniqueInput[]
    update?: ResidentUpdateWithWhereUniqueWithoutEstateInput | ResidentUpdateWithWhereUniqueWithoutEstateInput[]
    updateMany?: ResidentUpdateManyWithWhereWithoutEstateInput | ResidentUpdateManyWithWhereWithoutEstateInput[]
    deleteMany?: ResidentScalarWhereInput | ResidentScalarWhereInput[]
  }

  export type UserUpdateManyWithoutEstateNestedInput = {
    create?: XOR<UserCreateWithoutEstateInput, UserUncheckedCreateWithoutEstateInput> | UserCreateWithoutEstateInput[] | UserUncheckedCreateWithoutEstateInput[]
    connectOrCreate?: UserCreateOrConnectWithoutEstateInput | UserCreateOrConnectWithoutEstateInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutEstateInput | UserUpsertWithWhereUniqueWithoutEstateInput[]
    createMany?: UserCreateManyEstateInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutEstateInput | UserUpdateWithWhereUniqueWithoutEstateInput[]
    updateMany?: UserUpdateManyWithWhereWithoutEstateInput | UserUpdateManyWithWhereWithoutEstateInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type VisitorUpdateManyWithoutEstateNestedInput = {
    create?: XOR<VisitorCreateWithoutEstateInput, VisitorUncheckedCreateWithoutEstateInput> | VisitorCreateWithoutEstateInput[] | VisitorUncheckedCreateWithoutEstateInput[]
    connectOrCreate?: VisitorCreateOrConnectWithoutEstateInput | VisitorCreateOrConnectWithoutEstateInput[]
    upsert?: VisitorUpsertWithWhereUniqueWithoutEstateInput | VisitorUpsertWithWhereUniqueWithoutEstateInput[]
    createMany?: VisitorCreateManyEstateInputEnvelope
    set?: VisitorWhereUniqueInput | VisitorWhereUniqueInput[]
    disconnect?: VisitorWhereUniqueInput | VisitorWhereUniqueInput[]
    delete?: VisitorWhereUniqueInput | VisitorWhereUniqueInput[]
    connect?: VisitorWhereUniqueInput | VisitorWhereUniqueInput[]
    update?: VisitorUpdateWithWhereUniqueWithoutEstateInput | VisitorUpdateWithWhereUniqueWithoutEstateInput[]
    updateMany?: VisitorUpdateManyWithWhereWithoutEstateInput | VisitorUpdateManyWithWhereWithoutEstateInput[]
    deleteMany?: VisitorScalarWhereInput | VisitorScalarWhereInput[]
  }

  export type ResidentUncheckedUpdateManyWithoutEstateNestedInput = {
    create?: XOR<ResidentCreateWithoutEstateInput, ResidentUncheckedCreateWithoutEstateInput> | ResidentCreateWithoutEstateInput[] | ResidentUncheckedCreateWithoutEstateInput[]
    connectOrCreate?: ResidentCreateOrConnectWithoutEstateInput | ResidentCreateOrConnectWithoutEstateInput[]
    upsert?: ResidentUpsertWithWhereUniqueWithoutEstateInput | ResidentUpsertWithWhereUniqueWithoutEstateInput[]
    createMany?: ResidentCreateManyEstateInputEnvelope
    set?: ResidentWhereUniqueInput | ResidentWhereUniqueInput[]
    disconnect?: ResidentWhereUniqueInput | ResidentWhereUniqueInput[]
    delete?: ResidentWhereUniqueInput | ResidentWhereUniqueInput[]
    connect?: ResidentWhereUniqueInput | ResidentWhereUniqueInput[]
    update?: ResidentUpdateWithWhereUniqueWithoutEstateInput | ResidentUpdateWithWhereUniqueWithoutEstateInput[]
    updateMany?: ResidentUpdateManyWithWhereWithoutEstateInput | ResidentUpdateManyWithWhereWithoutEstateInput[]
    deleteMany?: ResidentScalarWhereInput | ResidentScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutEstateNestedInput = {
    create?: XOR<UserCreateWithoutEstateInput, UserUncheckedCreateWithoutEstateInput> | UserCreateWithoutEstateInput[] | UserUncheckedCreateWithoutEstateInput[]
    connectOrCreate?: UserCreateOrConnectWithoutEstateInput | UserCreateOrConnectWithoutEstateInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutEstateInput | UserUpsertWithWhereUniqueWithoutEstateInput[]
    createMany?: UserCreateManyEstateInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutEstateInput | UserUpdateWithWhereUniqueWithoutEstateInput[]
    updateMany?: UserUpdateManyWithWhereWithoutEstateInput | UserUpdateManyWithWhereWithoutEstateInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type VisitorUncheckedUpdateManyWithoutEstateNestedInput = {
    create?: XOR<VisitorCreateWithoutEstateInput, VisitorUncheckedCreateWithoutEstateInput> | VisitorCreateWithoutEstateInput[] | VisitorUncheckedCreateWithoutEstateInput[]
    connectOrCreate?: VisitorCreateOrConnectWithoutEstateInput | VisitorCreateOrConnectWithoutEstateInput[]
    upsert?: VisitorUpsertWithWhereUniqueWithoutEstateInput | VisitorUpsertWithWhereUniqueWithoutEstateInput[]
    createMany?: VisitorCreateManyEstateInputEnvelope
    set?: VisitorWhereUniqueInput | VisitorWhereUniqueInput[]
    disconnect?: VisitorWhereUniqueInput | VisitorWhereUniqueInput[]
    delete?: VisitorWhereUniqueInput | VisitorWhereUniqueInput[]
    connect?: VisitorWhereUniqueInput | VisitorWhereUniqueInput[]
    update?: VisitorUpdateWithWhereUniqueWithoutEstateInput | VisitorUpdateWithWhereUniqueWithoutEstateInput[]
    updateMany?: VisitorUpdateManyWithWhereWithoutEstateInput | VisitorUpdateManyWithWhereWithoutEstateInput[]
    deleteMany?: VisitorScalarWhereInput | VisitorScalarWhereInput[]
  }

  export type EstateCreateNestedOneWithoutUsersInput = {
    create?: XOR<EstateCreateWithoutUsersInput, EstateUncheckedCreateWithoutUsersInput>
    connectOrCreate?: EstateCreateOrConnectWithoutUsersInput
    connect?: EstateWhereUniqueInput
  }

  export type ResidentCreateNestedOneWithoutUserInput = {
    create?: XOR<ResidentCreateWithoutUserInput, ResidentUncheckedCreateWithoutUserInput>
    connectOrCreate?: ResidentCreateOrConnectWithoutUserInput
    connect?: ResidentWhereUniqueInput
  }

  export type GateLogCreateNestedManyWithoutGuardInput = {
    create?: XOR<GateLogCreateWithoutGuardInput, GateLogUncheckedCreateWithoutGuardInput> | GateLogCreateWithoutGuardInput[] | GateLogUncheckedCreateWithoutGuardInput[]
    connectOrCreate?: GateLogCreateOrConnectWithoutGuardInput | GateLogCreateOrConnectWithoutGuardInput[]
    createMany?: GateLogCreateManyGuardInputEnvelope
    connect?: GateLogWhereUniqueInput | GateLogWhereUniqueInput[]
  }

  export type ResidentUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<ResidentCreateWithoutUserInput, ResidentUncheckedCreateWithoutUserInput>
    connectOrCreate?: ResidentCreateOrConnectWithoutUserInput
    connect?: ResidentWhereUniqueInput
  }

  export type GateLogUncheckedCreateNestedManyWithoutGuardInput = {
    create?: XOR<GateLogCreateWithoutGuardInput, GateLogUncheckedCreateWithoutGuardInput> | GateLogCreateWithoutGuardInput[] | GateLogUncheckedCreateWithoutGuardInput[]
    connectOrCreate?: GateLogCreateOrConnectWithoutGuardInput | GateLogCreateOrConnectWithoutGuardInput[]
    createMany?: GateLogCreateManyGuardInputEnvelope
    connect?: GateLogWhereUniqueInput | GateLogWhereUniqueInput[]
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type EstateUpdateOneRequiredWithoutUsersNestedInput = {
    create?: XOR<EstateCreateWithoutUsersInput, EstateUncheckedCreateWithoutUsersInput>
    connectOrCreate?: EstateCreateOrConnectWithoutUsersInput
    upsert?: EstateUpsertWithoutUsersInput
    connect?: EstateWhereUniqueInput
    update?: XOR<XOR<EstateUpdateToOneWithWhereWithoutUsersInput, EstateUpdateWithoutUsersInput>, EstateUncheckedUpdateWithoutUsersInput>
  }

  export type ResidentUpdateOneWithoutUserNestedInput = {
    create?: XOR<ResidentCreateWithoutUserInput, ResidentUncheckedCreateWithoutUserInput>
    connectOrCreate?: ResidentCreateOrConnectWithoutUserInput
    upsert?: ResidentUpsertWithoutUserInput
    disconnect?: ResidentWhereInput | boolean
    delete?: ResidentWhereInput | boolean
    connect?: ResidentWhereUniqueInput
    update?: XOR<XOR<ResidentUpdateToOneWithWhereWithoutUserInput, ResidentUpdateWithoutUserInput>, ResidentUncheckedUpdateWithoutUserInput>
  }

  export type GateLogUpdateManyWithoutGuardNestedInput = {
    create?: XOR<GateLogCreateWithoutGuardInput, GateLogUncheckedCreateWithoutGuardInput> | GateLogCreateWithoutGuardInput[] | GateLogUncheckedCreateWithoutGuardInput[]
    connectOrCreate?: GateLogCreateOrConnectWithoutGuardInput | GateLogCreateOrConnectWithoutGuardInput[]
    upsert?: GateLogUpsertWithWhereUniqueWithoutGuardInput | GateLogUpsertWithWhereUniqueWithoutGuardInput[]
    createMany?: GateLogCreateManyGuardInputEnvelope
    set?: GateLogWhereUniqueInput | GateLogWhereUniqueInput[]
    disconnect?: GateLogWhereUniqueInput | GateLogWhereUniqueInput[]
    delete?: GateLogWhereUniqueInput | GateLogWhereUniqueInput[]
    connect?: GateLogWhereUniqueInput | GateLogWhereUniqueInput[]
    update?: GateLogUpdateWithWhereUniqueWithoutGuardInput | GateLogUpdateWithWhereUniqueWithoutGuardInput[]
    updateMany?: GateLogUpdateManyWithWhereWithoutGuardInput | GateLogUpdateManyWithWhereWithoutGuardInput[]
    deleteMany?: GateLogScalarWhereInput | GateLogScalarWhereInput[]
  }

  export type ResidentUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<ResidentCreateWithoutUserInput, ResidentUncheckedCreateWithoutUserInput>
    connectOrCreate?: ResidentCreateOrConnectWithoutUserInput
    upsert?: ResidentUpsertWithoutUserInput
    disconnect?: ResidentWhereInput | boolean
    delete?: ResidentWhereInput | boolean
    connect?: ResidentWhereUniqueInput
    update?: XOR<XOR<ResidentUpdateToOneWithWhereWithoutUserInput, ResidentUpdateWithoutUserInput>, ResidentUncheckedUpdateWithoutUserInput>
  }

  export type GateLogUncheckedUpdateManyWithoutGuardNestedInput = {
    create?: XOR<GateLogCreateWithoutGuardInput, GateLogUncheckedCreateWithoutGuardInput> | GateLogCreateWithoutGuardInput[] | GateLogUncheckedCreateWithoutGuardInput[]
    connectOrCreate?: GateLogCreateOrConnectWithoutGuardInput | GateLogCreateOrConnectWithoutGuardInput[]
    upsert?: GateLogUpsertWithWhereUniqueWithoutGuardInput | GateLogUpsertWithWhereUniqueWithoutGuardInput[]
    createMany?: GateLogCreateManyGuardInputEnvelope
    set?: GateLogWhereUniqueInput | GateLogWhereUniqueInput[]
    disconnect?: GateLogWhereUniqueInput | GateLogWhereUniqueInput[]
    delete?: GateLogWhereUniqueInput | GateLogWhereUniqueInput[]
    connect?: GateLogWhereUniqueInput | GateLogWhereUniqueInput[]
    update?: GateLogUpdateWithWhereUniqueWithoutGuardInput | GateLogUpdateWithWhereUniqueWithoutGuardInput[]
    updateMany?: GateLogUpdateManyWithWhereWithoutGuardInput | GateLogUpdateManyWithWhereWithoutGuardInput[]
    deleteMany?: GateLogScalarWhereInput | GateLogScalarWhereInput[]
  }

  export type EstateCreateNestedOneWithoutResidentsInput = {
    create?: XOR<EstateCreateWithoutResidentsInput, EstateUncheckedCreateWithoutResidentsInput>
    connectOrCreate?: EstateCreateOrConnectWithoutResidentsInput
    connect?: EstateWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutResidentInput = {
    create?: XOR<UserCreateWithoutResidentInput, UserUncheckedCreateWithoutResidentInput>
    connectOrCreate?: UserCreateOrConnectWithoutResidentInput
    connect?: UserWhereUniqueInput
  }

  export type VisitorCreateNestedManyWithoutResidentInput = {
    create?: XOR<VisitorCreateWithoutResidentInput, VisitorUncheckedCreateWithoutResidentInput> | VisitorCreateWithoutResidentInput[] | VisitorUncheckedCreateWithoutResidentInput[]
    connectOrCreate?: VisitorCreateOrConnectWithoutResidentInput | VisitorCreateOrConnectWithoutResidentInput[]
    createMany?: VisitorCreateManyResidentInputEnvelope
    connect?: VisitorWhereUniqueInput | VisitorWhereUniqueInput[]
  }

  export type VisitorUncheckedCreateNestedManyWithoutResidentInput = {
    create?: XOR<VisitorCreateWithoutResidentInput, VisitorUncheckedCreateWithoutResidentInput> | VisitorCreateWithoutResidentInput[] | VisitorUncheckedCreateWithoutResidentInput[]
    connectOrCreate?: VisitorCreateOrConnectWithoutResidentInput | VisitorCreateOrConnectWithoutResidentInput[]
    createMany?: VisitorCreateManyResidentInputEnvelope
    connect?: VisitorWhereUniqueInput | VisitorWhereUniqueInput[]
  }

  export type EnumResidentStatusFieldUpdateOperationsInput = {
    set?: $Enums.ResidentStatus
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type EstateUpdateOneRequiredWithoutResidentsNestedInput = {
    create?: XOR<EstateCreateWithoutResidentsInput, EstateUncheckedCreateWithoutResidentsInput>
    connectOrCreate?: EstateCreateOrConnectWithoutResidentsInput
    upsert?: EstateUpsertWithoutResidentsInput
    connect?: EstateWhereUniqueInput
    update?: XOR<XOR<EstateUpdateToOneWithWhereWithoutResidentsInput, EstateUpdateWithoutResidentsInput>, EstateUncheckedUpdateWithoutResidentsInput>
  }

  export type UserUpdateOneWithoutResidentNestedInput = {
    create?: XOR<UserCreateWithoutResidentInput, UserUncheckedCreateWithoutResidentInput>
    connectOrCreate?: UserCreateOrConnectWithoutResidentInput
    upsert?: UserUpsertWithoutResidentInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutResidentInput, UserUpdateWithoutResidentInput>, UserUncheckedUpdateWithoutResidentInput>
  }

  export type VisitorUpdateManyWithoutResidentNestedInput = {
    create?: XOR<VisitorCreateWithoutResidentInput, VisitorUncheckedCreateWithoutResidentInput> | VisitorCreateWithoutResidentInput[] | VisitorUncheckedCreateWithoutResidentInput[]
    connectOrCreate?: VisitorCreateOrConnectWithoutResidentInput | VisitorCreateOrConnectWithoutResidentInput[]
    upsert?: VisitorUpsertWithWhereUniqueWithoutResidentInput | VisitorUpsertWithWhereUniqueWithoutResidentInput[]
    createMany?: VisitorCreateManyResidentInputEnvelope
    set?: VisitorWhereUniqueInput | VisitorWhereUniqueInput[]
    disconnect?: VisitorWhereUniqueInput | VisitorWhereUniqueInput[]
    delete?: VisitorWhereUniqueInput | VisitorWhereUniqueInput[]
    connect?: VisitorWhereUniqueInput | VisitorWhereUniqueInput[]
    update?: VisitorUpdateWithWhereUniqueWithoutResidentInput | VisitorUpdateWithWhereUniqueWithoutResidentInput[]
    updateMany?: VisitorUpdateManyWithWhereWithoutResidentInput | VisitorUpdateManyWithWhereWithoutResidentInput[]
    deleteMany?: VisitorScalarWhereInput | VisitorScalarWhereInput[]
  }

  export type VisitorUncheckedUpdateManyWithoutResidentNestedInput = {
    create?: XOR<VisitorCreateWithoutResidentInput, VisitorUncheckedCreateWithoutResidentInput> | VisitorCreateWithoutResidentInput[] | VisitorUncheckedCreateWithoutResidentInput[]
    connectOrCreate?: VisitorCreateOrConnectWithoutResidentInput | VisitorCreateOrConnectWithoutResidentInput[]
    upsert?: VisitorUpsertWithWhereUniqueWithoutResidentInput | VisitorUpsertWithWhereUniqueWithoutResidentInput[]
    createMany?: VisitorCreateManyResidentInputEnvelope
    set?: VisitorWhereUniqueInput | VisitorWhereUniqueInput[]
    disconnect?: VisitorWhereUniqueInput | VisitorWhereUniqueInput[]
    delete?: VisitorWhereUniqueInput | VisitorWhereUniqueInput[]
    connect?: VisitorWhereUniqueInput | VisitorWhereUniqueInput[]
    update?: VisitorUpdateWithWhereUniqueWithoutResidentInput | VisitorUpdateWithWhereUniqueWithoutResidentInput[]
    updateMany?: VisitorUpdateManyWithWhereWithoutResidentInput | VisitorUpdateManyWithWhereWithoutResidentInput[]
    deleteMany?: VisitorScalarWhereInput | VisitorScalarWhereInput[]
  }

  export type EstateCreateNestedOneWithoutVisitorsInput = {
    create?: XOR<EstateCreateWithoutVisitorsInput, EstateUncheckedCreateWithoutVisitorsInput>
    connectOrCreate?: EstateCreateOrConnectWithoutVisitorsInput
    connect?: EstateWhereUniqueInput
  }

  export type ResidentCreateNestedOneWithoutVisitorsInput = {
    create?: XOR<ResidentCreateWithoutVisitorsInput, ResidentUncheckedCreateWithoutVisitorsInput>
    connectOrCreate?: ResidentCreateOrConnectWithoutVisitorsInput
    connect?: ResidentWhereUniqueInput
  }

  export type GateLogCreateNestedManyWithoutVisitorInput = {
    create?: XOR<GateLogCreateWithoutVisitorInput, GateLogUncheckedCreateWithoutVisitorInput> | GateLogCreateWithoutVisitorInput[] | GateLogUncheckedCreateWithoutVisitorInput[]
    connectOrCreate?: GateLogCreateOrConnectWithoutVisitorInput | GateLogCreateOrConnectWithoutVisitorInput[]
    createMany?: GateLogCreateManyVisitorInputEnvelope
    connect?: GateLogWhereUniqueInput | GateLogWhereUniqueInput[]
  }

  export type GateLogUncheckedCreateNestedManyWithoutVisitorInput = {
    create?: XOR<GateLogCreateWithoutVisitorInput, GateLogUncheckedCreateWithoutVisitorInput> | GateLogCreateWithoutVisitorInput[] | GateLogUncheckedCreateWithoutVisitorInput[]
    connectOrCreate?: GateLogCreateOrConnectWithoutVisitorInput | GateLogCreateOrConnectWithoutVisitorInput[]
    createMany?: GateLogCreateManyVisitorInputEnvelope
    connect?: GateLogWhereUniqueInput | GateLogWhereUniqueInput[]
  }

  export type EnumVisitorStatusFieldUpdateOperationsInput = {
    set?: $Enums.VisitorStatus
  }

  export type EstateUpdateOneRequiredWithoutVisitorsNestedInput = {
    create?: XOR<EstateCreateWithoutVisitorsInput, EstateUncheckedCreateWithoutVisitorsInput>
    connectOrCreate?: EstateCreateOrConnectWithoutVisitorsInput
    upsert?: EstateUpsertWithoutVisitorsInput
    connect?: EstateWhereUniqueInput
    update?: XOR<XOR<EstateUpdateToOneWithWhereWithoutVisitorsInput, EstateUpdateWithoutVisitorsInput>, EstateUncheckedUpdateWithoutVisitorsInput>
  }

  export type ResidentUpdateOneRequiredWithoutVisitorsNestedInput = {
    create?: XOR<ResidentCreateWithoutVisitorsInput, ResidentUncheckedCreateWithoutVisitorsInput>
    connectOrCreate?: ResidentCreateOrConnectWithoutVisitorsInput
    upsert?: ResidentUpsertWithoutVisitorsInput
    connect?: ResidentWhereUniqueInput
    update?: XOR<XOR<ResidentUpdateToOneWithWhereWithoutVisitorsInput, ResidentUpdateWithoutVisitorsInput>, ResidentUncheckedUpdateWithoutVisitorsInput>
  }

  export type GateLogUpdateManyWithoutVisitorNestedInput = {
    create?: XOR<GateLogCreateWithoutVisitorInput, GateLogUncheckedCreateWithoutVisitorInput> | GateLogCreateWithoutVisitorInput[] | GateLogUncheckedCreateWithoutVisitorInput[]
    connectOrCreate?: GateLogCreateOrConnectWithoutVisitorInput | GateLogCreateOrConnectWithoutVisitorInput[]
    upsert?: GateLogUpsertWithWhereUniqueWithoutVisitorInput | GateLogUpsertWithWhereUniqueWithoutVisitorInput[]
    createMany?: GateLogCreateManyVisitorInputEnvelope
    set?: GateLogWhereUniqueInput | GateLogWhereUniqueInput[]
    disconnect?: GateLogWhereUniqueInput | GateLogWhereUniqueInput[]
    delete?: GateLogWhereUniqueInput | GateLogWhereUniqueInput[]
    connect?: GateLogWhereUniqueInput | GateLogWhereUniqueInput[]
    update?: GateLogUpdateWithWhereUniqueWithoutVisitorInput | GateLogUpdateWithWhereUniqueWithoutVisitorInput[]
    updateMany?: GateLogUpdateManyWithWhereWithoutVisitorInput | GateLogUpdateManyWithWhereWithoutVisitorInput[]
    deleteMany?: GateLogScalarWhereInput | GateLogScalarWhereInput[]
  }

  export type GateLogUncheckedUpdateManyWithoutVisitorNestedInput = {
    create?: XOR<GateLogCreateWithoutVisitorInput, GateLogUncheckedCreateWithoutVisitorInput> | GateLogCreateWithoutVisitorInput[] | GateLogUncheckedCreateWithoutVisitorInput[]
    connectOrCreate?: GateLogCreateOrConnectWithoutVisitorInput | GateLogCreateOrConnectWithoutVisitorInput[]
    upsert?: GateLogUpsertWithWhereUniqueWithoutVisitorInput | GateLogUpsertWithWhereUniqueWithoutVisitorInput[]
    createMany?: GateLogCreateManyVisitorInputEnvelope
    set?: GateLogWhereUniqueInput | GateLogWhereUniqueInput[]
    disconnect?: GateLogWhereUniqueInput | GateLogWhereUniqueInput[]
    delete?: GateLogWhereUniqueInput | GateLogWhereUniqueInput[]
    connect?: GateLogWhereUniqueInput | GateLogWhereUniqueInput[]
    update?: GateLogUpdateWithWhereUniqueWithoutVisitorInput | GateLogUpdateWithWhereUniqueWithoutVisitorInput[]
    updateMany?: GateLogUpdateManyWithWhereWithoutVisitorInput | GateLogUpdateManyWithWhereWithoutVisitorInput[]
    deleteMany?: GateLogScalarWhereInput | GateLogScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutGateLogsInput = {
    create?: XOR<UserCreateWithoutGateLogsInput, UserUncheckedCreateWithoutGateLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutGateLogsInput
    connect?: UserWhereUniqueInput
  }

  export type VisitorCreateNestedOneWithoutGateLogsInput = {
    create?: XOR<VisitorCreateWithoutGateLogsInput, VisitorUncheckedCreateWithoutGateLogsInput>
    connectOrCreate?: VisitorCreateOrConnectWithoutGateLogsInput
    connect?: VisitorWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutGateLogsNestedInput = {
    create?: XOR<UserCreateWithoutGateLogsInput, UserUncheckedCreateWithoutGateLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutGateLogsInput
    upsert?: UserUpsertWithoutGateLogsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutGateLogsInput, UserUpdateWithoutGateLogsInput>, UserUncheckedUpdateWithoutGateLogsInput>
  }

  export type VisitorUpdateOneRequiredWithoutGateLogsNestedInput = {
    create?: XOR<VisitorCreateWithoutGateLogsInput, VisitorUncheckedCreateWithoutGateLogsInput>
    connectOrCreate?: VisitorCreateOrConnectWithoutGateLogsInput
    upsert?: VisitorUpsertWithoutGateLogsInput
    connect?: VisitorWhereUniqueInput
    update?: XOR<XOR<VisitorUpdateToOneWithWhereWithoutGateLogsInput, VisitorUpdateWithoutGateLogsInput>, VisitorUncheckedUpdateWithoutGateLogsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumResidentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ResidentStatus | EnumResidentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ResidentStatus[] | ListEnumResidentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ResidentStatus[] | ListEnumResidentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumResidentStatusFilter<$PrismaModel> | $Enums.ResidentStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedEnumResidentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ResidentStatus | EnumResidentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ResidentStatus[] | ListEnumResidentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ResidentStatus[] | ListEnumResidentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumResidentStatusWithAggregatesFilter<$PrismaModel> | $Enums.ResidentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumResidentStatusFilter<$PrismaModel>
    _max?: NestedEnumResidentStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumVisitorStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.VisitorStatus | EnumVisitorStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VisitorStatus[] | ListEnumVisitorStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VisitorStatus[] | ListEnumVisitorStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVisitorStatusFilter<$PrismaModel> | $Enums.VisitorStatus
  }

  export type NestedEnumVisitorStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VisitorStatus | EnumVisitorStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VisitorStatus[] | ListEnumVisitorStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VisitorStatus[] | ListEnumVisitorStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVisitorStatusWithAggregatesFilter<$PrismaModel> | $Enums.VisitorStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVisitorStatusFilter<$PrismaModel>
    _max?: NestedEnumVisitorStatusFilter<$PrismaModel>
  }

  export type ResidentCreateWithoutEstateInput = {
    id?: string
    first_name: string
    last_name: string
    email: string
    phone: string
    dob: string
    gender: string
    status?: $Enums.ResidentStatus
    house_no: string
    block: string
    home_address: string
    state_of_origin: string
    lga: string
    id_type: string
    id_no: string
    id_document_front: string
    id_document_back: string
    bvn?: string | null
    alternate_phone?: string | null
    next_of_kin_name?: string | null
    next_of_kin_phone?: string | null
    next_of_kin_email?: string | null
    next_of_kin_relationship?: string | null
    guarantor_name: string
    guarantor_occupation: string
    guarantor_work_address: string
    guarantor_id_no: string
    guarantor_id_relationship: string
    signed_guarantor_letter_upload: string
    vehicle_plate_no: string
    vehicle_make: string
    vehicle_color?: string | null
    proof_of_address_upload: string
    passport: string
    tenancy_ownership_doc: string
    wallet_pin?: string | null
    ndprConsentDataProcessing: boolean
    ndprConsentIdentity: boolean
    ndprConsentThirdParty: boolean
    ndprConsentGivenAt?: Date | string | null
    approvedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    user?: UserCreateNestedOneWithoutResidentInput
    visitors?: VisitorCreateNestedManyWithoutResidentInput
  }

  export type ResidentUncheckedCreateWithoutEstateInput = {
    id?: string
    first_name: string
    last_name: string
    email: string
    phone: string
    dob: string
    gender: string
    userId?: string | null
    status?: $Enums.ResidentStatus
    house_no: string
    block: string
    home_address: string
    state_of_origin: string
    lga: string
    id_type: string
    id_no: string
    id_document_front: string
    id_document_back: string
    bvn?: string | null
    alternate_phone?: string | null
    next_of_kin_name?: string | null
    next_of_kin_phone?: string | null
    next_of_kin_email?: string | null
    next_of_kin_relationship?: string | null
    guarantor_name: string
    guarantor_occupation: string
    guarantor_work_address: string
    guarantor_id_no: string
    guarantor_id_relationship: string
    signed_guarantor_letter_upload: string
    vehicle_plate_no: string
    vehicle_make: string
    vehicle_color?: string | null
    proof_of_address_upload: string
    passport: string
    tenancy_ownership_doc: string
    wallet_pin?: string | null
    ndprConsentDataProcessing: boolean
    ndprConsentIdentity: boolean
    ndprConsentThirdParty: boolean
    ndprConsentGivenAt?: Date | string | null
    approvedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    visitors?: VisitorUncheckedCreateNestedManyWithoutResidentInput
  }

  export type ResidentCreateOrConnectWithoutEstateInput = {
    where: ResidentWhereUniqueInput
    create: XOR<ResidentCreateWithoutEstateInput, ResidentUncheckedCreateWithoutEstateInput>
  }

  export type ResidentCreateManyEstateInputEnvelope = {
    data: ResidentCreateManyEstateInput | ResidentCreateManyEstateInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutEstateInput = {
    id?: string
    email: string
    password: string
    role: $Enums.Role
    first_login?: boolean
    createdAt?: Date | string
    resident?: ResidentCreateNestedOneWithoutUserInput
    gateLogs?: GateLogCreateNestedManyWithoutGuardInput
  }

  export type UserUncheckedCreateWithoutEstateInput = {
    id?: string
    email: string
    password: string
    role: $Enums.Role
    first_login?: boolean
    createdAt?: Date | string
    resident?: ResidentUncheckedCreateNestedOneWithoutUserInput
    gateLogs?: GateLogUncheckedCreateNestedManyWithoutGuardInput
  }

  export type UserCreateOrConnectWithoutEstateInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutEstateInput, UserUncheckedCreateWithoutEstateInput>
  }

  export type UserCreateManyEstateInputEnvelope = {
    data: UserCreateManyEstateInput | UserCreateManyEstateInput[]
    skipDuplicates?: boolean
  }

  export type VisitorCreateWithoutEstateInput = {
    id?: string
    name: string
    phone?: string | null
    status?: $Enums.VisitorStatus
    visitDate: Date | string
    createdAt?: Date | string
    resident: ResidentCreateNestedOneWithoutVisitorsInput
    gateLogs?: GateLogCreateNestedManyWithoutVisitorInput
  }

  export type VisitorUncheckedCreateWithoutEstateInput = {
    id?: string
    residentId: string
    name: string
    phone?: string | null
    status?: $Enums.VisitorStatus
    visitDate: Date | string
    createdAt?: Date | string
    gateLogs?: GateLogUncheckedCreateNestedManyWithoutVisitorInput
  }

  export type VisitorCreateOrConnectWithoutEstateInput = {
    where: VisitorWhereUniqueInput
    create: XOR<VisitorCreateWithoutEstateInput, VisitorUncheckedCreateWithoutEstateInput>
  }

  export type VisitorCreateManyEstateInputEnvelope = {
    data: VisitorCreateManyEstateInput | VisitorCreateManyEstateInput[]
    skipDuplicates?: boolean
  }

  export type ResidentUpsertWithWhereUniqueWithoutEstateInput = {
    where: ResidentWhereUniqueInput
    update: XOR<ResidentUpdateWithoutEstateInput, ResidentUncheckedUpdateWithoutEstateInput>
    create: XOR<ResidentCreateWithoutEstateInput, ResidentUncheckedCreateWithoutEstateInput>
  }

  export type ResidentUpdateWithWhereUniqueWithoutEstateInput = {
    where: ResidentWhereUniqueInput
    data: XOR<ResidentUpdateWithoutEstateInput, ResidentUncheckedUpdateWithoutEstateInput>
  }

  export type ResidentUpdateManyWithWhereWithoutEstateInput = {
    where: ResidentScalarWhereInput
    data: XOR<ResidentUpdateManyMutationInput, ResidentUncheckedUpdateManyWithoutEstateInput>
  }

  export type ResidentScalarWhereInput = {
    AND?: ResidentScalarWhereInput | ResidentScalarWhereInput[]
    OR?: ResidentScalarWhereInput[]
    NOT?: ResidentScalarWhereInput | ResidentScalarWhereInput[]
    id?: StringFilter<"Resident"> | string
    first_name?: StringFilter<"Resident"> | string
    last_name?: StringFilter<"Resident"> | string
    email?: StringFilter<"Resident"> | string
    phone?: StringFilter<"Resident"> | string
    dob?: StringFilter<"Resident"> | string
    gender?: StringFilter<"Resident"> | string
    estateId?: StringFilter<"Resident"> | string
    userId?: StringNullableFilter<"Resident"> | string | null
    status?: EnumResidentStatusFilter<"Resident"> | $Enums.ResidentStatus
    house_no?: StringFilter<"Resident"> | string
    block?: StringFilter<"Resident"> | string
    home_address?: StringFilter<"Resident"> | string
    state_of_origin?: StringFilter<"Resident"> | string
    lga?: StringFilter<"Resident"> | string
    id_type?: StringFilter<"Resident"> | string
    id_no?: StringFilter<"Resident"> | string
    id_document_front?: StringFilter<"Resident"> | string
    id_document_back?: StringFilter<"Resident"> | string
    bvn?: StringNullableFilter<"Resident"> | string | null
    alternate_phone?: StringNullableFilter<"Resident"> | string | null
    next_of_kin_name?: StringNullableFilter<"Resident"> | string | null
    next_of_kin_phone?: StringNullableFilter<"Resident"> | string | null
    next_of_kin_email?: StringNullableFilter<"Resident"> | string | null
    next_of_kin_relationship?: StringNullableFilter<"Resident"> | string | null
    guarantor_name?: StringFilter<"Resident"> | string
    guarantor_occupation?: StringFilter<"Resident"> | string
    guarantor_work_address?: StringFilter<"Resident"> | string
    guarantor_id_no?: StringFilter<"Resident"> | string
    guarantor_id_relationship?: StringFilter<"Resident"> | string
    signed_guarantor_letter_upload?: StringFilter<"Resident"> | string
    vehicle_plate_no?: StringFilter<"Resident"> | string
    vehicle_make?: StringFilter<"Resident"> | string
    vehicle_color?: StringNullableFilter<"Resident"> | string | null
    proof_of_address_upload?: StringFilter<"Resident"> | string
    passport?: StringFilter<"Resident"> | string
    tenancy_ownership_doc?: StringFilter<"Resident"> | string
    wallet_pin?: StringNullableFilter<"Resident"> | string | null
    ndprConsentDataProcessing?: BoolFilter<"Resident"> | boolean
    ndprConsentIdentity?: BoolFilter<"Resident"> | boolean
    ndprConsentThirdParty?: BoolFilter<"Resident"> | boolean
    ndprConsentGivenAt?: DateTimeNullableFilter<"Resident"> | Date | string | null
    approvedAt?: DateTimeNullableFilter<"Resident"> | Date | string | null
    rejectedAt?: DateTimeNullableFilter<"Resident"> | Date | string | null
    createdAt?: DateTimeFilter<"Resident"> | Date | string
  }

  export type UserUpsertWithWhereUniqueWithoutEstateInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutEstateInput, UserUncheckedUpdateWithoutEstateInput>
    create: XOR<UserCreateWithoutEstateInput, UserUncheckedCreateWithoutEstateInput>
  }

  export type UserUpdateWithWhereUniqueWithoutEstateInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutEstateInput, UserUncheckedUpdateWithoutEstateInput>
  }

  export type UserUpdateManyWithWhereWithoutEstateInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutEstateInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    first_login?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    estateId?: StringFilter<"User"> | string
  }

  export type VisitorUpsertWithWhereUniqueWithoutEstateInput = {
    where: VisitorWhereUniqueInput
    update: XOR<VisitorUpdateWithoutEstateInput, VisitorUncheckedUpdateWithoutEstateInput>
    create: XOR<VisitorCreateWithoutEstateInput, VisitorUncheckedCreateWithoutEstateInput>
  }

  export type VisitorUpdateWithWhereUniqueWithoutEstateInput = {
    where: VisitorWhereUniqueInput
    data: XOR<VisitorUpdateWithoutEstateInput, VisitorUncheckedUpdateWithoutEstateInput>
  }

  export type VisitorUpdateManyWithWhereWithoutEstateInput = {
    where: VisitorScalarWhereInput
    data: XOR<VisitorUpdateManyMutationInput, VisitorUncheckedUpdateManyWithoutEstateInput>
  }

  export type VisitorScalarWhereInput = {
    AND?: VisitorScalarWhereInput | VisitorScalarWhereInput[]
    OR?: VisitorScalarWhereInput[]
    NOT?: VisitorScalarWhereInput | VisitorScalarWhereInput[]
    id?: StringFilter<"Visitor"> | string
    estateId?: StringFilter<"Visitor"> | string
    residentId?: StringFilter<"Visitor"> | string
    name?: StringFilter<"Visitor"> | string
    phone?: StringNullableFilter<"Visitor"> | string | null
    status?: EnumVisitorStatusFilter<"Visitor"> | $Enums.VisitorStatus
    visitDate?: DateTimeFilter<"Visitor"> | Date | string
    createdAt?: DateTimeFilter<"Visitor"> | Date | string
  }

  export type EstateCreateWithoutUsersInput = {
    id?: string
    name: string
    address: string
    totalHouses: number
    createdAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    residents?: ResidentCreateNestedManyWithoutEstateInput
    visitors?: VisitorCreateNestedManyWithoutEstateInput
  }

  export type EstateUncheckedCreateWithoutUsersInput = {
    id?: string
    name: string
    address: string
    totalHouses: number
    createdAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    residents?: ResidentUncheckedCreateNestedManyWithoutEstateInput
    visitors?: VisitorUncheckedCreateNestedManyWithoutEstateInput
  }

  export type EstateCreateOrConnectWithoutUsersInput = {
    where: EstateWhereUniqueInput
    create: XOR<EstateCreateWithoutUsersInput, EstateUncheckedCreateWithoutUsersInput>
  }

  export type ResidentCreateWithoutUserInput = {
    id?: string
    first_name: string
    last_name: string
    email: string
    phone: string
    dob: string
    gender: string
    status?: $Enums.ResidentStatus
    house_no: string
    block: string
    home_address: string
    state_of_origin: string
    lga: string
    id_type: string
    id_no: string
    id_document_front: string
    id_document_back: string
    bvn?: string | null
    alternate_phone?: string | null
    next_of_kin_name?: string | null
    next_of_kin_phone?: string | null
    next_of_kin_email?: string | null
    next_of_kin_relationship?: string | null
    guarantor_name: string
    guarantor_occupation: string
    guarantor_work_address: string
    guarantor_id_no: string
    guarantor_id_relationship: string
    signed_guarantor_letter_upload: string
    vehicle_plate_no: string
    vehicle_make: string
    vehicle_color?: string | null
    proof_of_address_upload: string
    passport: string
    tenancy_ownership_doc: string
    wallet_pin?: string | null
    ndprConsentDataProcessing: boolean
    ndprConsentIdentity: boolean
    ndprConsentThirdParty: boolean
    ndprConsentGivenAt?: Date | string | null
    approvedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    estate: EstateCreateNestedOneWithoutResidentsInput
    visitors?: VisitorCreateNestedManyWithoutResidentInput
  }

  export type ResidentUncheckedCreateWithoutUserInput = {
    id?: string
    first_name: string
    last_name: string
    email: string
    phone: string
    dob: string
    gender: string
    estateId: string
    status?: $Enums.ResidentStatus
    house_no: string
    block: string
    home_address: string
    state_of_origin: string
    lga: string
    id_type: string
    id_no: string
    id_document_front: string
    id_document_back: string
    bvn?: string | null
    alternate_phone?: string | null
    next_of_kin_name?: string | null
    next_of_kin_phone?: string | null
    next_of_kin_email?: string | null
    next_of_kin_relationship?: string | null
    guarantor_name: string
    guarantor_occupation: string
    guarantor_work_address: string
    guarantor_id_no: string
    guarantor_id_relationship: string
    signed_guarantor_letter_upload: string
    vehicle_plate_no: string
    vehicle_make: string
    vehicle_color?: string | null
    proof_of_address_upload: string
    passport: string
    tenancy_ownership_doc: string
    wallet_pin?: string | null
    ndprConsentDataProcessing: boolean
    ndprConsentIdentity: boolean
    ndprConsentThirdParty: boolean
    ndprConsentGivenAt?: Date | string | null
    approvedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    visitors?: VisitorUncheckedCreateNestedManyWithoutResidentInput
  }

  export type ResidentCreateOrConnectWithoutUserInput = {
    where: ResidentWhereUniqueInput
    create: XOR<ResidentCreateWithoutUserInput, ResidentUncheckedCreateWithoutUserInput>
  }

  export type GateLogCreateWithoutGuardInput = {
    id?: string
    action: string
    timestamp?: Date | string
    visitor: VisitorCreateNestedOneWithoutGateLogsInput
  }

  export type GateLogUncheckedCreateWithoutGuardInput = {
    id?: string
    visitorId: string
    action: string
    timestamp?: Date | string
  }

  export type GateLogCreateOrConnectWithoutGuardInput = {
    where: GateLogWhereUniqueInput
    create: XOR<GateLogCreateWithoutGuardInput, GateLogUncheckedCreateWithoutGuardInput>
  }

  export type GateLogCreateManyGuardInputEnvelope = {
    data: GateLogCreateManyGuardInput | GateLogCreateManyGuardInput[]
    skipDuplicates?: boolean
  }

  export type EstateUpsertWithoutUsersInput = {
    update: XOR<EstateUpdateWithoutUsersInput, EstateUncheckedUpdateWithoutUsersInput>
    create: XOR<EstateCreateWithoutUsersInput, EstateUncheckedCreateWithoutUsersInput>
    where?: EstateWhereInput
  }

  export type EstateUpdateToOneWithWhereWithoutUsersInput = {
    where?: EstateWhereInput
    data: XOR<EstateUpdateWithoutUsersInput, EstateUncheckedUpdateWithoutUsersInput>
  }

  export type EstateUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    totalHouses?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    residents?: ResidentUpdateManyWithoutEstateNestedInput
    visitors?: VisitorUpdateManyWithoutEstateNestedInput
  }

  export type EstateUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    totalHouses?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    residents?: ResidentUncheckedUpdateManyWithoutEstateNestedInput
    visitors?: VisitorUncheckedUpdateManyWithoutEstateNestedInput
  }

  export type ResidentUpsertWithoutUserInput = {
    update: XOR<ResidentUpdateWithoutUserInput, ResidentUncheckedUpdateWithoutUserInput>
    create: XOR<ResidentCreateWithoutUserInput, ResidentUncheckedCreateWithoutUserInput>
    where?: ResidentWhereInput
  }

  export type ResidentUpdateToOneWithWhereWithoutUserInput = {
    where?: ResidentWhereInput
    data: XOR<ResidentUpdateWithoutUserInput, ResidentUncheckedUpdateWithoutUserInput>
  }

  export type ResidentUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    dob?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    status?: EnumResidentStatusFieldUpdateOperationsInput | $Enums.ResidentStatus
    house_no?: StringFieldUpdateOperationsInput | string
    block?: StringFieldUpdateOperationsInput | string
    home_address?: StringFieldUpdateOperationsInput | string
    state_of_origin?: StringFieldUpdateOperationsInput | string
    lga?: StringFieldUpdateOperationsInput | string
    id_type?: StringFieldUpdateOperationsInput | string
    id_no?: StringFieldUpdateOperationsInput | string
    id_document_front?: StringFieldUpdateOperationsInput | string
    id_document_back?: StringFieldUpdateOperationsInput | string
    bvn?: NullableStringFieldUpdateOperationsInput | string | null
    alternate_phone?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_name?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_phone?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_email?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_relationship?: NullableStringFieldUpdateOperationsInput | string | null
    guarantor_name?: StringFieldUpdateOperationsInput | string
    guarantor_occupation?: StringFieldUpdateOperationsInput | string
    guarantor_work_address?: StringFieldUpdateOperationsInput | string
    guarantor_id_no?: StringFieldUpdateOperationsInput | string
    guarantor_id_relationship?: StringFieldUpdateOperationsInput | string
    signed_guarantor_letter_upload?: StringFieldUpdateOperationsInput | string
    vehicle_plate_no?: StringFieldUpdateOperationsInput | string
    vehicle_make?: StringFieldUpdateOperationsInput | string
    vehicle_color?: NullableStringFieldUpdateOperationsInput | string | null
    proof_of_address_upload?: StringFieldUpdateOperationsInput | string
    passport?: StringFieldUpdateOperationsInput | string
    tenancy_ownership_doc?: StringFieldUpdateOperationsInput | string
    wallet_pin?: NullableStringFieldUpdateOperationsInput | string | null
    ndprConsentDataProcessing?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentIdentity?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentThirdParty?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentGivenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    estate?: EstateUpdateOneRequiredWithoutResidentsNestedInput
    visitors?: VisitorUpdateManyWithoutResidentNestedInput
  }

  export type ResidentUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    dob?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    estateId?: StringFieldUpdateOperationsInput | string
    status?: EnumResidentStatusFieldUpdateOperationsInput | $Enums.ResidentStatus
    house_no?: StringFieldUpdateOperationsInput | string
    block?: StringFieldUpdateOperationsInput | string
    home_address?: StringFieldUpdateOperationsInput | string
    state_of_origin?: StringFieldUpdateOperationsInput | string
    lga?: StringFieldUpdateOperationsInput | string
    id_type?: StringFieldUpdateOperationsInput | string
    id_no?: StringFieldUpdateOperationsInput | string
    id_document_front?: StringFieldUpdateOperationsInput | string
    id_document_back?: StringFieldUpdateOperationsInput | string
    bvn?: NullableStringFieldUpdateOperationsInput | string | null
    alternate_phone?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_name?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_phone?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_email?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_relationship?: NullableStringFieldUpdateOperationsInput | string | null
    guarantor_name?: StringFieldUpdateOperationsInput | string
    guarantor_occupation?: StringFieldUpdateOperationsInput | string
    guarantor_work_address?: StringFieldUpdateOperationsInput | string
    guarantor_id_no?: StringFieldUpdateOperationsInput | string
    guarantor_id_relationship?: StringFieldUpdateOperationsInput | string
    signed_guarantor_letter_upload?: StringFieldUpdateOperationsInput | string
    vehicle_plate_no?: StringFieldUpdateOperationsInput | string
    vehicle_make?: StringFieldUpdateOperationsInput | string
    vehicle_color?: NullableStringFieldUpdateOperationsInput | string | null
    proof_of_address_upload?: StringFieldUpdateOperationsInput | string
    passport?: StringFieldUpdateOperationsInput | string
    tenancy_ownership_doc?: StringFieldUpdateOperationsInput | string
    wallet_pin?: NullableStringFieldUpdateOperationsInput | string | null
    ndprConsentDataProcessing?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentIdentity?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentThirdParty?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentGivenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    visitors?: VisitorUncheckedUpdateManyWithoutResidentNestedInput
  }

  export type GateLogUpsertWithWhereUniqueWithoutGuardInput = {
    where: GateLogWhereUniqueInput
    update: XOR<GateLogUpdateWithoutGuardInput, GateLogUncheckedUpdateWithoutGuardInput>
    create: XOR<GateLogCreateWithoutGuardInput, GateLogUncheckedCreateWithoutGuardInput>
  }

  export type GateLogUpdateWithWhereUniqueWithoutGuardInput = {
    where: GateLogWhereUniqueInput
    data: XOR<GateLogUpdateWithoutGuardInput, GateLogUncheckedUpdateWithoutGuardInput>
  }

  export type GateLogUpdateManyWithWhereWithoutGuardInput = {
    where: GateLogScalarWhereInput
    data: XOR<GateLogUpdateManyMutationInput, GateLogUncheckedUpdateManyWithoutGuardInput>
  }

  export type GateLogScalarWhereInput = {
    AND?: GateLogScalarWhereInput | GateLogScalarWhereInput[]
    OR?: GateLogScalarWhereInput[]
    NOT?: GateLogScalarWhereInput | GateLogScalarWhereInput[]
    id?: StringFilter<"GateLog"> | string
    visitorId?: StringFilter<"GateLog"> | string
    guardId?: StringFilter<"GateLog"> | string
    action?: StringFilter<"GateLog"> | string
    timestamp?: DateTimeFilter<"GateLog"> | Date | string
  }

  export type EstateCreateWithoutResidentsInput = {
    id?: string
    name: string
    address: string
    totalHouses: number
    createdAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserCreateNestedManyWithoutEstateInput
    visitors?: VisitorCreateNestedManyWithoutEstateInput
  }

  export type EstateUncheckedCreateWithoutResidentsInput = {
    id?: string
    name: string
    address: string
    totalHouses: number
    createdAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUncheckedCreateNestedManyWithoutEstateInput
    visitors?: VisitorUncheckedCreateNestedManyWithoutEstateInput
  }

  export type EstateCreateOrConnectWithoutResidentsInput = {
    where: EstateWhereUniqueInput
    create: XOR<EstateCreateWithoutResidentsInput, EstateUncheckedCreateWithoutResidentsInput>
  }

  export type UserCreateWithoutResidentInput = {
    id?: string
    email: string
    password: string
    role: $Enums.Role
    first_login?: boolean
    createdAt?: Date | string
    estate: EstateCreateNestedOneWithoutUsersInput
    gateLogs?: GateLogCreateNestedManyWithoutGuardInput
  }

  export type UserUncheckedCreateWithoutResidentInput = {
    id?: string
    email: string
    password: string
    role: $Enums.Role
    first_login?: boolean
    createdAt?: Date | string
    estateId: string
    gateLogs?: GateLogUncheckedCreateNestedManyWithoutGuardInput
  }

  export type UserCreateOrConnectWithoutResidentInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutResidentInput, UserUncheckedCreateWithoutResidentInput>
  }

  export type VisitorCreateWithoutResidentInput = {
    id?: string
    name: string
    phone?: string | null
    status?: $Enums.VisitorStatus
    visitDate: Date | string
    createdAt?: Date | string
    estate: EstateCreateNestedOneWithoutVisitorsInput
    gateLogs?: GateLogCreateNestedManyWithoutVisitorInput
  }

  export type VisitorUncheckedCreateWithoutResidentInput = {
    id?: string
    estateId: string
    name: string
    phone?: string | null
    status?: $Enums.VisitorStatus
    visitDate: Date | string
    createdAt?: Date | string
    gateLogs?: GateLogUncheckedCreateNestedManyWithoutVisitorInput
  }

  export type VisitorCreateOrConnectWithoutResidentInput = {
    where: VisitorWhereUniqueInput
    create: XOR<VisitorCreateWithoutResidentInput, VisitorUncheckedCreateWithoutResidentInput>
  }

  export type VisitorCreateManyResidentInputEnvelope = {
    data: VisitorCreateManyResidentInput | VisitorCreateManyResidentInput[]
    skipDuplicates?: boolean
  }

  export type EstateUpsertWithoutResidentsInput = {
    update: XOR<EstateUpdateWithoutResidentsInput, EstateUncheckedUpdateWithoutResidentsInput>
    create: XOR<EstateCreateWithoutResidentsInput, EstateUncheckedCreateWithoutResidentsInput>
    where?: EstateWhereInput
  }

  export type EstateUpdateToOneWithWhereWithoutResidentsInput = {
    where?: EstateWhereInput
    data: XOR<EstateUpdateWithoutResidentsInput, EstateUncheckedUpdateWithoutResidentsInput>
  }

  export type EstateUpdateWithoutResidentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    totalHouses?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUpdateManyWithoutEstateNestedInput
    visitors?: VisitorUpdateManyWithoutEstateNestedInput
  }

  export type EstateUncheckedUpdateWithoutResidentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    totalHouses?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    users?: UserUncheckedUpdateManyWithoutEstateNestedInput
    visitors?: VisitorUncheckedUpdateManyWithoutEstateNestedInput
  }

  export type UserUpsertWithoutResidentInput = {
    update: XOR<UserUpdateWithoutResidentInput, UserUncheckedUpdateWithoutResidentInput>
    create: XOR<UserCreateWithoutResidentInput, UserUncheckedCreateWithoutResidentInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutResidentInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutResidentInput, UserUncheckedUpdateWithoutResidentInput>
  }

  export type UserUpdateWithoutResidentInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    first_login?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    estate?: EstateUpdateOneRequiredWithoutUsersNestedInput
    gateLogs?: GateLogUpdateManyWithoutGuardNestedInput
  }

  export type UserUncheckedUpdateWithoutResidentInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    first_login?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    estateId?: StringFieldUpdateOperationsInput | string
    gateLogs?: GateLogUncheckedUpdateManyWithoutGuardNestedInput
  }

  export type VisitorUpsertWithWhereUniqueWithoutResidentInput = {
    where: VisitorWhereUniqueInput
    update: XOR<VisitorUpdateWithoutResidentInput, VisitorUncheckedUpdateWithoutResidentInput>
    create: XOR<VisitorCreateWithoutResidentInput, VisitorUncheckedCreateWithoutResidentInput>
  }

  export type VisitorUpdateWithWhereUniqueWithoutResidentInput = {
    where: VisitorWhereUniqueInput
    data: XOR<VisitorUpdateWithoutResidentInput, VisitorUncheckedUpdateWithoutResidentInput>
  }

  export type VisitorUpdateManyWithWhereWithoutResidentInput = {
    where: VisitorScalarWhereInput
    data: XOR<VisitorUpdateManyMutationInput, VisitorUncheckedUpdateManyWithoutResidentInput>
  }

  export type EstateCreateWithoutVisitorsInput = {
    id?: string
    name: string
    address: string
    totalHouses: number
    createdAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    residents?: ResidentCreateNestedManyWithoutEstateInput
    users?: UserCreateNestedManyWithoutEstateInput
  }

  export type EstateUncheckedCreateWithoutVisitorsInput = {
    id?: string
    name: string
    address: string
    totalHouses: number
    createdAt?: Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    residents?: ResidentUncheckedCreateNestedManyWithoutEstateInput
    users?: UserUncheckedCreateNestedManyWithoutEstateInput
  }

  export type EstateCreateOrConnectWithoutVisitorsInput = {
    where: EstateWhereUniqueInput
    create: XOR<EstateCreateWithoutVisitorsInput, EstateUncheckedCreateWithoutVisitorsInput>
  }

  export type ResidentCreateWithoutVisitorsInput = {
    id?: string
    first_name: string
    last_name: string
    email: string
    phone: string
    dob: string
    gender: string
    status?: $Enums.ResidentStatus
    house_no: string
    block: string
    home_address: string
    state_of_origin: string
    lga: string
    id_type: string
    id_no: string
    id_document_front: string
    id_document_back: string
    bvn?: string | null
    alternate_phone?: string | null
    next_of_kin_name?: string | null
    next_of_kin_phone?: string | null
    next_of_kin_email?: string | null
    next_of_kin_relationship?: string | null
    guarantor_name: string
    guarantor_occupation: string
    guarantor_work_address: string
    guarantor_id_no: string
    guarantor_id_relationship: string
    signed_guarantor_letter_upload: string
    vehicle_plate_no: string
    vehicle_make: string
    vehicle_color?: string | null
    proof_of_address_upload: string
    passport: string
    tenancy_ownership_doc: string
    wallet_pin?: string | null
    ndprConsentDataProcessing: boolean
    ndprConsentIdentity: boolean
    ndprConsentThirdParty: boolean
    ndprConsentGivenAt?: Date | string | null
    approvedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    estate: EstateCreateNestedOneWithoutResidentsInput
    user?: UserCreateNestedOneWithoutResidentInput
  }

  export type ResidentUncheckedCreateWithoutVisitorsInput = {
    id?: string
    first_name: string
    last_name: string
    email: string
    phone: string
    dob: string
    gender: string
    estateId: string
    userId?: string | null
    status?: $Enums.ResidentStatus
    house_no: string
    block: string
    home_address: string
    state_of_origin: string
    lga: string
    id_type: string
    id_no: string
    id_document_front: string
    id_document_back: string
    bvn?: string | null
    alternate_phone?: string | null
    next_of_kin_name?: string | null
    next_of_kin_phone?: string | null
    next_of_kin_email?: string | null
    next_of_kin_relationship?: string | null
    guarantor_name: string
    guarantor_occupation: string
    guarantor_work_address: string
    guarantor_id_no: string
    guarantor_id_relationship: string
    signed_guarantor_letter_upload: string
    vehicle_plate_no: string
    vehicle_make: string
    vehicle_color?: string | null
    proof_of_address_upload: string
    passport: string
    tenancy_ownership_doc: string
    wallet_pin?: string | null
    ndprConsentDataProcessing: boolean
    ndprConsentIdentity: boolean
    ndprConsentThirdParty: boolean
    ndprConsentGivenAt?: Date | string | null
    approvedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type ResidentCreateOrConnectWithoutVisitorsInput = {
    where: ResidentWhereUniqueInput
    create: XOR<ResidentCreateWithoutVisitorsInput, ResidentUncheckedCreateWithoutVisitorsInput>
  }

  export type GateLogCreateWithoutVisitorInput = {
    id?: string
    action: string
    timestamp?: Date | string
    guard: UserCreateNestedOneWithoutGateLogsInput
  }

  export type GateLogUncheckedCreateWithoutVisitorInput = {
    id?: string
    guardId: string
    action: string
    timestamp?: Date | string
  }

  export type GateLogCreateOrConnectWithoutVisitorInput = {
    where: GateLogWhereUniqueInput
    create: XOR<GateLogCreateWithoutVisitorInput, GateLogUncheckedCreateWithoutVisitorInput>
  }

  export type GateLogCreateManyVisitorInputEnvelope = {
    data: GateLogCreateManyVisitorInput | GateLogCreateManyVisitorInput[]
    skipDuplicates?: boolean
  }

  export type EstateUpsertWithoutVisitorsInput = {
    update: XOR<EstateUpdateWithoutVisitorsInput, EstateUncheckedUpdateWithoutVisitorsInput>
    create: XOR<EstateCreateWithoutVisitorsInput, EstateUncheckedCreateWithoutVisitorsInput>
    where?: EstateWhereInput
  }

  export type EstateUpdateToOneWithWhereWithoutVisitorsInput = {
    where?: EstateWhereInput
    data: XOR<EstateUpdateWithoutVisitorsInput, EstateUncheckedUpdateWithoutVisitorsInput>
  }

  export type EstateUpdateWithoutVisitorsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    totalHouses?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    residents?: ResidentUpdateManyWithoutEstateNestedInput
    users?: UserUpdateManyWithoutEstateNestedInput
  }

  export type EstateUncheckedUpdateWithoutVisitorsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    totalHouses?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    residents?: ResidentUncheckedUpdateManyWithoutEstateNestedInput
    users?: UserUncheckedUpdateManyWithoutEstateNestedInput
  }

  export type ResidentUpsertWithoutVisitorsInput = {
    update: XOR<ResidentUpdateWithoutVisitorsInput, ResidentUncheckedUpdateWithoutVisitorsInput>
    create: XOR<ResidentCreateWithoutVisitorsInput, ResidentUncheckedCreateWithoutVisitorsInput>
    where?: ResidentWhereInput
  }

  export type ResidentUpdateToOneWithWhereWithoutVisitorsInput = {
    where?: ResidentWhereInput
    data: XOR<ResidentUpdateWithoutVisitorsInput, ResidentUncheckedUpdateWithoutVisitorsInput>
  }

  export type ResidentUpdateWithoutVisitorsInput = {
    id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    dob?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    status?: EnumResidentStatusFieldUpdateOperationsInput | $Enums.ResidentStatus
    house_no?: StringFieldUpdateOperationsInput | string
    block?: StringFieldUpdateOperationsInput | string
    home_address?: StringFieldUpdateOperationsInput | string
    state_of_origin?: StringFieldUpdateOperationsInput | string
    lga?: StringFieldUpdateOperationsInput | string
    id_type?: StringFieldUpdateOperationsInput | string
    id_no?: StringFieldUpdateOperationsInput | string
    id_document_front?: StringFieldUpdateOperationsInput | string
    id_document_back?: StringFieldUpdateOperationsInput | string
    bvn?: NullableStringFieldUpdateOperationsInput | string | null
    alternate_phone?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_name?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_phone?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_email?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_relationship?: NullableStringFieldUpdateOperationsInput | string | null
    guarantor_name?: StringFieldUpdateOperationsInput | string
    guarantor_occupation?: StringFieldUpdateOperationsInput | string
    guarantor_work_address?: StringFieldUpdateOperationsInput | string
    guarantor_id_no?: StringFieldUpdateOperationsInput | string
    guarantor_id_relationship?: StringFieldUpdateOperationsInput | string
    signed_guarantor_letter_upload?: StringFieldUpdateOperationsInput | string
    vehicle_plate_no?: StringFieldUpdateOperationsInput | string
    vehicle_make?: StringFieldUpdateOperationsInput | string
    vehicle_color?: NullableStringFieldUpdateOperationsInput | string | null
    proof_of_address_upload?: StringFieldUpdateOperationsInput | string
    passport?: StringFieldUpdateOperationsInput | string
    tenancy_ownership_doc?: StringFieldUpdateOperationsInput | string
    wallet_pin?: NullableStringFieldUpdateOperationsInput | string | null
    ndprConsentDataProcessing?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentIdentity?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentThirdParty?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentGivenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    estate?: EstateUpdateOneRequiredWithoutResidentsNestedInput
    user?: UserUpdateOneWithoutResidentNestedInput
  }

  export type ResidentUncheckedUpdateWithoutVisitorsInput = {
    id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    dob?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    estateId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumResidentStatusFieldUpdateOperationsInput | $Enums.ResidentStatus
    house_no?: StringFieldUpdateOperationsInput | string
    block?: StringFieldUpdateOperationsInput | string
    home_address?: StringFieldUpdateOperationsInput | string
    state_of_origin?: StringFieldUpdateOperationsInput | string
    lga?: StringFieldUpdateOperationsInput | string
    id_type?: StringFieldUpdateOperationsInput | string
    id_no?: StringFieldUpdateOperationsInput | string
    id_document_front?: StringFieldUpdateOperationsInput | string
    id_document_back?: StringFieldUpdateOperationsInput | string
    bvn?: NullableStringFieldUpdateOperationsInput | string | null
    alternate_phone?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_name?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_phone?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_email?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_relationship?: NullableStringFieldUpdateOperationsInput | string | null
    guarantor_name?: StringFieldUpdateOperationsInput | string
    guarantor_occupation?: StringFieldUpdateOperationsInput | string
    guarantor_work_address?: StringFieldUpdateOperationsInput | string
    guarantor_id_no?: StringFieldUpdateOperationsInput | string
    guarantor_id_relationship?: StringFieldUpdateOperationsInput | string
    signed_guarantor_letter_upload?: StringFieldUpdateOperationsInput | string
    vehicle_plate_no?: StringFieldUpdateOperationsInput | string
    vehicle_make?: StringFieldUpdateOperationsInput | string
    vehicle_color?: NullableStringFieldUpdateOperationsInput | string | null
    proof_of_address_upload?: StringFieldUpdateOperationsInput | string
    passport?: StringFieldUpdateOperationsInput | string
    tenancy_ownership_doc?: StringFieldUpdateOperationsInput | string
    wallet_pin?: NullableStringFieldUpdateOperationsInput | string | null
    ndprConsentDataProcessing?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentIdentity?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentThirdParty?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentGivenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GateLogUpsertWithWhereUniqueWithoutVisitorInput = {
    where: GateLogWhereUniqueInput
    update: XOR<GateLogUpdateWithoutVisitorInput, GateLogUncheckedUpdateWithoutVisitorInput>
    create: XOR<GateLogCreateWithoutVisitorInput, GateLogUncheckedCreateWithoutVisitorInput>
  }

  export type GateLogUpdateWithWhereUniqueWithoutVisitorInput = {
    where: GateLogWhereUniqueInput
    data: XOR<GateLogUpdateWithoutVisitorInput, GateLogUncheckedUpdateWithoutVisitorInput>
  }

  export type GateLogUpdateManyWithWhereWithoutVisitorInput = {
    where: GateLogScalarWhereInput
    data: XOR<GateLogUpdateManyMutationInput, GateLogUncheckedUpdateManyWithoutVisitorInput>
  }

  export type UserCreateWithoutGateLogsInput = {
    id?: string
    email: string
    password: string
    role: $Enums.Role
    first_login?: boolean
    createdAt?: Date | string
    estate: EstateCreateNestedOneWithoutUsersInput
    resident?: ResidentCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutGateLogsInput = {
    id?: string
    email: string
    password: string
    role: $Enums.Role
    first_login?: boolean
    createdAt?: Date | string
    estateId: string
    resident?: ResidentUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutGateLogsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutGateLogsInput, UserUncheckedCreateWithoutGateLogsInput>
  }

  export type VisitorCreateWithoutGateLogsInput = {
    id?: string
    name: string
    phone?: string | null
    status?: $Enums.VisitorStatus
    visitDate: Date | string
    createdAt?: Date | string
    estate: EstateCreateNestedOneWithoutVisitorsInput
    resident: ResidentCreateNestedOneWithoutVisitorsInput
  }

  export type VisitorUncheckedCreateWithoutGateLogsInput = {
    id?: string
    estateId: string
    residentId: string
    name: string
    phone?: string | null
    status?: $Enums.VisitorStatus
    visitDate: Date | string
    createdAt?: Date | string
  }

  export type VisitorCreateOrConnectWithoutGateLogsInput = {
    where: VisitorWhereUniqueInput
    create: XOR<VisitorCreateWithoutGateLogsInput, VisitorUncheckedCreateWithoutGateLogsInput>
  }

  export type UserUpsertWithoutGateLogsInput = {
    update: XOR<UserUpdateWithoutGateLogsInput, UserUncheckedUpdateWithoutGateLogsInput>
    create: XOR<UserCreateWithoutGateLogsInput, UserUncheckedCreateWithoutGateLogsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutGateLogsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutGateLogsInput, UserUncheckedUpdateWithoutGateLogsInput>
  }

  export type UserUpdateWithoutGateLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    first_login?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    estate?: EstateUpdateOneRequiredWithoutUsersNestedInput
    resident?: ResidentUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutGateLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    first_login?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    estateId?: StringFieldUpdateOperationsInput | string
    resident?: ResidentUncheckedUpdateOneWithoutUserNestedInput
  }

  export type VisitorUpsertWithoutGateLogsInput = {
    update: XOR<VisitorUpdateWithoutGateLogsInput, VisitorUncheckedUpdateWithoutGateLogsInput>
    create: XOR<VisitorCreateWithoutGateLogsInput, VisitorUncheckedCreateWithoutGateLogsInput>
    where?: VisitorWhereInput
  }

  export type VisitorUpdateToOneWithWhereWithoutGateLogsInput = {
    where?: VisitorWhereInput
    data: XOR<VisitorUpdateWithoutGateLogsInput, VisitorUncheckedUpdateWithoutGateLogsInput>
  }

  export type VisitorUpdateWithoutGateLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumVisitorStatusFieldUpdateOperationsInput | $Enums.VisitorStatus
    visitDate?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    estate?: EstateUpdateOneRequiredWithoutVisitorsNestedInput
    resident?: ResidentUpdateOneRequiredWithoutVisitorsNestedInput
  }

  export type VisitorUncheckedUpdateWithoutGateLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    estateId?: StringFieldUpdateOperationsInput | string
    residentId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumVisitorStatusFieldUpdateOperationsInput | $Enums.VisitorStatus
    visitDate?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResidentCreateManyEstateInput = {
    id?: string
    first_name: string
    last_name: string
    email: string
    phone: string
    dob: string
    gender: string
    userId?: string | null
    status?: $Enums.ResidentStatus
    house_no: string
    block: string
    home_address: string
    state_of_origin: string
    lga: string
    id_type: string
    id_no: string
    id_document_front: string
    id_document_back: string
    bvn?: string | null
    alternate_phone?: string | null
    next_of_kin_name?: string | null
    next_of_kin_phone?: string | null
    next_of_kin_email?: string | null
    next_of_kin_relationship?: string | null
    guarantor_name: string
    guarantor_occupation: string
    guarantor_work_address: string
    guarantor_id_no: string
    guarantor_id_relationship: string
    signed_guarantor_letter_upload: string
    vehicle_plate_no: string
    vehicle_make: string
    vehicle_color?: string | null
    proof_of_address_upload: string
    passport: string
    tenancy_ownership_doc: string
    wallet_pin?: string | null
    ndprConsentDataProcessing: boolean
    ndprConsentIdentity: boolean
    ndprConsentThirdParty: boolean
    ndprConsentGivenAt?: Date | string | null
    approvedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type UserCreateManyEstateInput = {
    id?: string
    email: string
    password: string
    role: $Enums.Role
    first_login?: boolean
    createdAt?: Date | string
  }

  export type VisitorCreateManyEstateInput = {
    id?: string
    residentId: string
    name: string
    phone?: string | null
    status?: $Enums.VisitorStatus
    visitDate: Date | string
    createdAt?: Date | string
  }

  export type ResidentUpdateWithoutEstateInput = {
    id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    dob?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    status?: EnumResidentStatusFieldUpdateOperationsInput | $Enums.ResidentStatus
    house_no?: StringFieldUpdateOperationsInput | string
    block?: StringFieldUpdateOperationsInput | string
    home_address?: StringFieldUpdateOperationsInput | string
    state_of_origin?: StringFieldUpdateOperationsInput | string
    lga?: StringFieldUpdateOperationsInput | string
    id_type?: StringFieldUpdateOperationsInput | string
    id_no?: StringFieldUpdateOperationsInput | string
    id_document_front?: StringFieldUpdateOperationsInput | string
    id_document_back?: StringFieldUpdateOperationsInput | string
    bvn?: NullableStringFieldUpdateOperationsInput | string | null
    alternate_phone?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_name?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_phone?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_email?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_relationship?: NullableStringFieldUpdateOperationsInput | string | null
    guarantor_name?: StringFieldUpdateOperationsInput | string
    guarantor_occupation?: StringFieldUpdateOperationsInput | string
    guarantor_work_address?: StringFieldUpdateOperationsInput | string
    guarantor_id_no?: StringFieldUpdateOperationsInput | string
    guarantor_id_relationship?: StringFieldUpdateOperationsInput | string
    signed_guarantor_letter_upload?: StringFieldUpdateOperationsInput | string
    vehicle_plate_no?: StringFieldUpdateOperationsInput | string
    vehicle_make?: StringFieldUpdateOperationsInput | string
    vehicle_color?: NullableStringFieldUpdateOperationsInput | string | null
    proof_of_address_upload?: StringFieldUpdateOperationsInput | string
    passport?: StringFieldUpdateOperationsInput | string
    tenancy_ownership_doc?: StringFieldUpdateOperationsInput | string
    wallet_pin?: NullableStringFieldUpdateOperationsInput | string | null
    ndprConsentDataProcessing?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentIdentity?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentThirdParty?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentGivenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutResidentNestedInput
    visitors?: VisitorUpdateManyWithoutResidentNestedInput
  }

  export type ResidentUncheckedUpdateWithoutEstateInput = {
    id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    dob?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumResidentStatusFieldUpdateOperationsInput | $Enums.ResidentStatus
    house_no?: StringFieldUpdateOperationsInput | string
    block?: StringFieldUpdateOperationsInput | string
    home_address?: StringFieldUpdateOperationsInput | string
    state_of_origin?: StringFieldUpdateOperationsInput | string
    lga?: StringFieldUpdateOperationsInput | string
    id_type?: StringFieldUpdateOperationsInput | string
    id_no?: StringFieldUpdateOperationsInput | string
    id_document_front?: StringFieldUpdateOperationsInput | string
    id_document_back?: StringFieldUpdateOperationsInput | string
    bvn?: NullableStringFieldUpdateOperationsInput | string | null
    alternate_phone?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_name?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_phone?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_email?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_relationship?: NullableStringFieldUpdateOperationsInput | string | null
    guarantor_name?: StringFieldUpdateOperationsInput | string
    guarantor_occupation?: StringFieldUpdateOperationsInput | string
    guarantor_work_address?: StringFieldUpdateOperationsInput | string
    guarantor_id_no?: StringFieldUpdateOperationsInput | string
    guarantor_id_relationship?: StringFieldUpdateOperationsInput | string
    signed_guarantor_letter_upload?: StringFieldUpdateOperationsInput | string
    vehicle_plate_no?: StringFieldUpdateOperationsInput | string
    vehicle_make?: StringFieldUpdateOperationsInput | string
    vehicle_color?: NullableStringFieldUpdateOperationsInput | string | null
    proof_of_address_upload?: StringFieldUpdateOperationsInput | string
    passport?: StringFieldUpdateOperationsInput | string
    tenancy_ownership_doc?: StringFieldUpdateOperationsInput | string
    wallet_pin?: NullableStringFieldUpdateOperationsInput | string | null
    ndprConsentDataProcessing?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentIdentity?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentThirdParty?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentGivenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    visitors?: VisitorUncheckedUpdateManyWithoutResidentNestedInput
  }

  export type ResidentUncheckedUpdateManyWithoutEstateInput = {
    id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    dob?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumResidentStatusFieldUpdateOperationsInput | $Enums.ResidentStatus
    house_no?: StringFieldUpdateOperationsInput | string
    block?: StringFieldUpdateOperationsInput | string
    home_address?: StringFieldUpdateOperationsInput | string
    state_of_origin?: StringFieldUpdateOperationsInput | string
    lga?: StringFieldUpdateOperationsInput | string
    id_type?: StringFieldUpdateOperationsInput | string
    id_no?: StringFieldUpdateOperationsInput | string
    id_document_front?: StringFieldUpdateOperationsInput | string
    id_document_back?: StringFieldUpdateOperationsInput | string
    bvn?: NullableStringFieldUpdateOperationsInput | string | null
    alternate_phone?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_name?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_phone?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_email?: NullableStringFieldUpdateOperationsInput | string | null
    next_of_kin_relationship?: NullableStringFieldUpdateOperationsInput | string | null
    guarantor_name?: StringFieldUpdateOperationsInput | string
    guarantor_occupation?: StringFieldUpdateOperationsInput | string
    guarantor_work_address?: StringFieldUpdateOperationsInput | string
    guarantor_id_no?: StringFieldUpdateOperationsInput | string
    guarantor_id_relationship?: StringFieldUpdateOperationsInput | string
    signed_guarantor_letter_upload?: StringFieldUpdateOperationsInput | string
    vehicle_plate_no?: StringFieldUpdateOperationsInput | string
    vehicle_make?: StringFieldUpdateOperationsInput | string
    vehicle_color?: NullableStringFieldUpdateOperationsInput | string | null
    proof_of_address_upload?: StringFieldUpdateOperationsInput | string
    passport?: StringFieldUpdateOperationsInput | string
    tenancy_ownership_doc?: StringFieldUpdateOperationsInput | string
    wallet_pin?: NullableStringFieldUpdateOperationsInput | string | null
    ndprConsentDataProcessing?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentIdentity?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentThirdParty?: BoolFieldUpdateOperationsInput | boolean
    ndprConsentGivenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpdateWithoutEstateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    first_login?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resident?: ResidentUpdateOneWithoutUserNestedInput
    gateLogs?: GateLogUpdateManyWithoutGuardNestedInput
  }

  export type UserUncheckedUpdateWithoutEstateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    first_login?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resident?: ResidentUncheckedUpdateOneWithoutUserNestedInput
    gateLogs?: GateLogUncheckedUpdateManyWithoutGuardNestedInput
  }

  export type UserUncheckedUpdateManyWithoutEstateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    first_login?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VisitorUpdateWithoutEstateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumVisitorStatusFieldUpdateOperationsInput | $Enums.VisitorStatus
    visitDate?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resident?: ResidentUpdateOneRequiredWithoutVisitorsNestedInput
    gateLogs?: GateLogUpdateManyWithoutVisitorNestedInput
  }

  export type VisitorUncheckedUpdateWithoutEstateInput = {
    id?: StringFieldUpdateOperationsInput | string
    residentId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumVisitorStatusFieldUpdateOperationsInput | $Enums.VisitorStatus
    visitDate?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gateLogs?: GateLogUncheckedUpdateManyWithoutVisitorNestedInput
  }

  export type VisitorUncheckedUpdateManyWithoutEstateInput = {
    id?: StringFieldUpdateOperationsInput | string
    residentId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumVisitorStatusFieldUpdateOperationsInput | $Enums.VisitorStatus
    visitDate?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GateLogCreateManyGuardInput = {
    id?: string
    visitorId: string
    action: string
    timestamp?: Date | string
  }

  export type GateLogUpdateWithoutGuardInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    visitor?: VisitorUpdateOneRequiredWithoutGateLogsNestedInput
  }

  export type GateLogUncheckedUpdateWithoutGuardInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitorId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GateLogUncheckedUpdateManyWithoutGuardInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitorId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VisitorCreateManyResidentInput = {
    id?: string
    estateId: string
    name: string
    phone?: string | null
    status?: $Enums.VisitorStatus
    visitDate: Date | string
    createdAt?: Date | string
  }

  export type VisitorUpdateWithoutResidentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumVisitorStatusFieldUpdateOperationsInput | $Enums.VisitorStatus
    visitDate?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    estate?: EstateUpdateOneRequiredWithoutVisitorsNestedInput
    gateLogs?: GateLogUpdateManyWithoutVisitorNestedInput
  }

  export type VisitorUncheckedUpdateWithoutResidentInput = {
    id?: StringFieldUpdateOperationsInput | string
    estateId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumVisitorStatusFieldUpdateOperationsInput | $Enums.VisitorStatus
    visitDate?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gateLogs?: GateLogUncheckedUpdateManyWithoutVisitorNestedInput
  }

  export type VisitorUncheckedUpdateManyWithoutResidentInput = {
    id?: StringFieldUpdateOperationsInput | string
    estateId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumVisitorStatusFieldUpdateOperationsInput | $Enums.VisitorStatus
    visitDate?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GateLogCreateManyVisitorInput = {
    id?: string
    guardId: string
    action: string
    timestamp?: Date | string
  }

  export type GateLogUpdateWithoutVisitorInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    guard?: UserUpdateOneRequiredWithoutGateLogsNestedInput
  }

  export type GateLogUncheckedUpdateWithoutVisitorInput = {
    id?: StringFieldUpdateOperationsInput | string
    guardId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GateLogUncheckedUpdateManyWithoutVisitorInput = {
    id?: StringFieldUpdateOperationsInput | string
    guardId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}