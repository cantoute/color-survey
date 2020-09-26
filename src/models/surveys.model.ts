// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/lib/hooks';
import logger from '../logger';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const surveys = sequelizeClient.define(
    'surveys',
    {
      id: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      json: {
        type: DataTypes.TEXT,
        allowNull: false,
        get: function () {
          const prop = 'json';
          const str = this.getDataValue(prop);
          if (str) {
            try {
              return JSON.parse(str);
            } catch (e) {
              logger.error(`failed to parse json from:\n%s`, str);
              return null;
            }
          }
          return null;
        },
        set: function (value = null) {
          const prop = 'json';
          try {
            this.setDataValue(prop, JSON.stringify(value));
          } catch (e) {
            logger.error(`Sequelize set(): Failed to JSON.stringify() - %s`, e.message);
            this.setDataValue(prop, null);
          }
        },
      },
    },
    {
      hooks: {
        beforeCount(options: any): HookReturn {
          options.raw = true;
        },
      },
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (surveys as any).associate = function (models: any): void {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return surveys;
}
