// import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { ConfigService } from '@nestjs/config';

// export const typeOrmConfig = (config: ConfigService): TypeOrmModuleOptions => {
//   return {
//     type: 'mysql',
//     synchronize: config.get('DB_SYNCHRONIZE'),
//     logging: config.get('DB_LOGGING') ? true : ['error', 'warn'],
//     entities: [],
//     replication: {
//       master: {
//         host: config.get('DB_HOST_WRITER'),
//         port: config.get('DB_PORT'),
//         username: config.get('DB_USER'),
//         password: config.get('DB_PASS'),
//         database: config.get('DB_NAME'),
//       },
//       slaves: [
//         {
//           host: config.get('DB_HOST_READER'),
//           port: config.get('DB_PORT'),
//           username: config.get('DB_USER'),
//           password: config.get('DB_PASS'),
//           database: config.get('DB_NAME'),
//         },
//       ],
//     },
//   };
// };
