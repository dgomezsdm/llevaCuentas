import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import '@capacitor-community/sqlite';
import { AlertController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteDBConnection,
  SQLiteConnection,
  capSQLiteSet,
  capSQLiteChanges,
  capSQLiteValues,
  capEchoResult,
  capSQLiteResult,
} from '@capacitor-community/sqlite';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { switchMap } from 'rxjs/operators';
import { of, from } from 'rxjs';
import { SQLiteService } from './sqlite.service';
import { CapacitorDataStorageSqlite } from 'capacitor-data-storage-sqlite';

// const { capacitorSqlite, device, storage } = Plugins;

const dbSetupKey = 'dbLlevaCuentas';
const dbNameKey = 'llevaCuentasDb';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  // sqlite: SQLiteConnection;
  // isService = false;
  // platform: string;
  // sqlitePlugin: any;
  // native = false;
  // db: SQLiteDBConnection;
  // dbReady = new BehaviorSubject(false);
  store: any;
  isService = false;
  platform: string;
  constructor(private sqlite: SQLiteService) {}
  /**
   * Plugin Initialization
   */
  async init(): Promise<void> {
    this.platform = Capacitor.getPlatform();
    this.store = CapacitorDataStorageSqlite;
    this.isService = true;
    console.log('in init ', this.platform, this.isService);
  }
  /*
   * Echo a value
   * @param value
   */
  async echo(value: string): Promise<any> {
    if (this.isService && this.store != null) {
      try {
        return await this.store.echo(value);
      } catch (err) {
        console.log(`Error ${err}`);
        return Promise.reject(new Error(err));
      }
    } else {
      return Promise.reject(new Error('openStore: Store not opened'));
    }
  }

  /*
   * Open a Store
   * @param _dbName string optional
   * @param _table string optional
   * @param _encrypted boolean optional
   * @param _mode string optional
   */
  async openStore(
    _dbName?: string,
    _table?: string,
    _encrypted?: boolean,
    _mode?: string
  ): Promise<void> {
    if (this.isService && this.store != null) {
      const database: string = _dbName ? _dbName : 'storage';
      const table: string = _table ? _table : 'storage_table';
      const encrypted: boolean = _encrypted ? _encrypted : false;
      const mode: string = _mode ? _mode : 'no-encryption';
      try {
        console.log('in openStore Service ');
        console.log(`database ${database}`);
        console.log(`table ${table}`);
        await this.store.openStore({ database, table, encrypted, mode });
        return Promise.resolve();
      } catch (err) {
        return Promise.reject(err);
      }
    } else {
      return Promise.reject(new Error('openStore: Store not opened'));
    }
  }
  /*
   * Close a store
   * @param dbName
   * @returns
   */
  async closeStore(dbName: string): Promise<void> {
    if (this.isService && this.store != null) {
      try {
        await this.store.closeStore({ database: dbName });
        return Promise.resolve();
      } catch (err) {
        return Promise.reject(err);
      }
    } else {
      return Promise.reject(new Error('close: Store not opened'));
    }
  }
  /*
   * Check if a store is opened
   * @param dbName
   * @returns
   */
  async isStoreOpen(dbName: string): Promise<void> {
    if (this.isService && this.store != null) {
      try {
        const ret = await this.store.isStoreOpen({ database: dbName });
        return Promise.resolve(ret);
      } catch (err) {
        return Promise.reject(err);
      }
    } else {
      return Promise.reject(new Error('isStoreOpen: Store not opened'));
    }
  }
  /*
   * Check if a store already exists
   * @param dbName
   * @returns
   */
  async isStoreExists(dbName: string): Promise<void> {
    if (this.isService && this.store != null) {
      try {
        const ret = await this.store.isStoreExists({ database: dbName });
        return Promise.resolve(ret);
      } catch (err) {
        return Promise.reject(err);
      }
    } else {
      return Promise.reject(new Error('isStoreExists: Store not opened'));
    }
  }
  /*
   * Create/Set a Table
   * @param table string
   */
  async setTable(table: string): Promise<void> {
    if (this.isService && this.store != null) {
      try {
        await this.store.setTable({ table });
        return Promise.resolve();
      } catch (err) {
        return Promise.reject(err);
      }
    } else {
      return Promise.reject(new Error('setTable: Store not opened'));
    }
  }
  /*
   * Set of Key
   * @param key string
   * @param value string
   */
  async setItem(key: string, value: string): Promise<void> {
    if (this.isService && this.store != null) {
      if (key.length > 0) {
        try {
          await this.store.set({ key, value });
          return Promise.resolve();
        } catch (err) {
          return Promise.reject(err);
        }
      } else {
        return Promise.reject(new Error('setItem: Must give a key'));
      }
    } else {
      return Promise.reject(new Error('setItem: Store not opened'));
    }
  }
  /*
   * Get the Value for a given Key
   * @param key string
   */
  async getItem(key: string): Promise<string> {
    if (this.isService && this.store != null) {
      if (key.length > 0) {
        try {
          const { value } = await this.store.get({ key });

          return Promise.resolve(value);
        } catch (err) {
          console.log(
            `$$$$$ in getItem key: ${key} err: ${JSON.stringify(err)}`
          );
          return Promise.reject(err);
        }
      } else {
        return Promise.reject(new Error('getItem: Must give a key'));
      }
    } else {
      return Promise.reject(new Error('getItem: Store not opened'));
    }
  }
  async isKey(key: string): Promise<boolean> {
    if (this.isService && this.store != null) {
      if (key.length > 0) {
        try {
          const { result } = await this.store.iskey({ key });
          return Promise.resolve(result);
        } catch (err) {
          return Promise.reject(err);
        }
      } else {
        return Promise.reject(new Error('isKey: Must give a key'));
      }
    } else {
      return Promise.reject(new Error('isKey: Store not opened'));
    }
  }

  async getAllKeys(): Promise<Array<string>> {
    if (this.isService && this.store != null) {
      try {
        const { keys } = await this.store.keys();
        return Promise.resolve(keys);
      } catch (err) {
        return Promise.reject(err);
      }
    } else {
      return Promise.reject(new Error('getAllKeys: Store not opened'));
    }
  }
  async getAllValues(): Promise<Array<string>> {
    if (this.isService && this.store != null) {
      try {
        const { values } = await this.store.values();
        return Promise.resolve(values);
      } catch (err) {
        return Promise.reject(err);
      }
    } else {
      return Promise.reject(new Error('getAllValues: Store not opened'));
    }
  }
  async getFilterValues(filter: string): Promise<Array<string>> {
    if (this.isService && this.store != null) {
      try {
        const { values } = await this.store.filtervalues({ filter });
        return Promise.resolve(values);
      } catch (err) {
        return Promise.reject(err);
      }
    } else {
      return Promise.reject(new Error('getFilterValues: Store not opened'));
    }
  }
  async getAllKeysValues(): Promise<Array<any>> {
    if (this.isService && this.store != null) {
      try {
        const { keysvalues } = await this.store.keysvalues();
        return Promise.resolve(keysvalues);
      } catch (err) {
        return Promise.reject(err);
      }
    } else {
      return Promise.reject(new Error('getAllKeysValues: Store not opened'));
    }
  }

  async removeItem(key: string): Promise<void> {
    if (this.isService && this.store != null) {
      if (key.length > 0) {
        try {
          await this.store.remove({ key });
          return Promise.resolve();
        } catch (err) {
          return Promise.reject(err);
        }
      } else {
        return Promise.reject(new Error('removeItem: Must give a key'));
      }
    } else {
      return Promise.reject(new Error('removeItem: Store not opened'));
    }
  }

  async clear(): Promise<void> {
    if (this.isService && this.store != null) {
      try {
        await this.store.clear();
        return Promise.resolve();
      } catch (err) {
        return Promise.reject(err.message);
      }
    } else {
      return Promise.reject(new Error('clear: Store not opened'));
    }
  }

  async deleteStore(_dbName?: string): Promise<void> {
    const database: string = _dbName ? _dbName : 'storage';
    await this.init();
    if (this.isService && this.store != null) {
      try {
        await this.store.deleteStore({ database });
        return Promise.resolve();
      } catch (err) {
        return Promise.reject(err.message);
      }
    } else {
      return Promise.reject(new Error('deleteStore: Store not opened'));
    }
  }
  async isTable(table: string): Promise<boolean> {
    if (this.isService && this.store != null) {
      if (table.length > 0) {
        try {
          const { result } = await this.store.isTable({ table });
          return Promise.resolve(result);
        } catch (err) {
          return Promise.reject(err);
        }
      } else {
        return Promise.reject(new Error('isTable: Must give a table'));
      }
    } else {
      return Promise.reject(new Error('isTable: Store not opened'));
    }
  }
  async getAllTables(): Promise<Array<string>> {
    if (this.isService && this.store != null) {
      try {
        const { tables } = await this.store.tables();
        return Promise.resolve(tables);
      } catch (err) {
        return Promise.reject(err);
      }
    } else {
      return Promise.reject(new Error('getAllTables: Store not opened'));
    }
  }
  async deleteTable(table?: string): Promise<void> {
    if (this.isService && this.store != null) {
      if (table.length > 0) {
        try {
          await this.store.deleteTable({ table });
          return Promise.resolve();
        } catch (err) {
          return Promise.reject(err);
        }
      } else {
        return Promise.reject(new Error('deleteTable: Must give a table'));
      }
    } else {
      return Promise.reject(new Error('deleteTable: Store not opened'));
    }
  }

  // getProductList() {
  //   return this.dbReady.pipe(
  //     switchMap((isReady) => {
  //       if (!isReady) {
  //         return of({ values: [] });
  //       } else {
  //         const statement = 'SELECT * FROM test;';
  //         return from(CapacitorSQLite.query({ statement, values: [] }));
  //       }
  //     })
  //   );
  // }

  // async addDummyProduct() {
  //   const db: SQLiteDBConnection = (this.db =
  //     await this.sqlite.retrieveConnection('db_issue90'));
  //   await db.open();

  //   // const randomValue = Math.floor(Math.random() * 100) + 1;
  //   // const randomVendor = Math.floor(Math.random() * 3) + 1;
  //   const statement = `INSERT INTO test (name) VALUES ('hola');`;
  //   const ret = await db.execute(statement);
  //   return ret;
  // }
  // async addDummyProduct2() {
  //   const db: SQLiteDBConnection = (this.db =
  //     await this.sqlite.retrieveConnection('db_issue90'));
  //   await db.open();

  //   // const randomValue = Math.floor(Math.random() * 100) + 1;
  //   // const randomVendor = Math.floor(Math.random() * 3) + 1;
  //   const statement = `SELECT * FROM test`;
  //   const ret = await db.execute(statement);
  //   return ret;
  // }
  /**
   * Plugin Initialization
   */
  //   initializePlugin(): Promise<boolean> {
  //     return new Promise((resolve) => {
  //       this.platform = Capacitor.getPlatform();
  //       if (this.platform === 'ios' || this.platform === 'android') {
  //         this.native = true;
  //       }
  //       console.log('*** native ' + this.native);
  //       this.sqlitePlugin = CapacitorSQLite;
  //       this.sqlite = new SQLiteConnection(this.sqlitePlugin);
  //       this.isService = true;
  //       console.log('$$$ in service this.isService ' + this.isService + ' $$$');
  //       resolve(true);
  //     });
  //   }
  //   /*** Echo a value
  //    * @param value
  //    */
  //   async echo(value: string): Promise<capEchoResult> {
  //     if (this.sqlite != null) {
  //       try {
  //         return await this.sqlite.echo(value);
  //       } catch (err) {
  //         return Promise.reject(new Error(err));
  //       }
  //     } else {
  //       return Promise.reject(new Error('no connection open'));
  //     }
  //   }
  //   async isSecretStored(): Promise<capSQLiteResult> {
  //     if (!this.native) {
  //       return Promise.reject(
  //         new Error(`Not implemented for ${this.platform} platform`)
  //       );
  //     }
  //     if (this.sqlite != null) {
  //       try {
  //         return Promise.resolve(await this.sqlite.isSecretStored());
  //       } catch (err) {
  //         return Promise.reject(new Error(err));
  //       }
  //     } else {
  //       return Promise.reject(new Error(`no connection open`));
  //     }
  //   }
  //   async setEncryptionSecret(passphrase: string): Promise<void> {
  //     if (!this.native) {
  //       return Promise.reject(
  //         new Error(`Not implemented for ${this.platform} platform`)
  //       );
  //     }
  //     if (this.sqlite != null) {
  //       try {
  //         return Promise.resolve(
  //           await this.sqlite.setEncryptionSecret(passphrase)
  //         );
  //       } catch (err) {
  //         return Promise.reject(new Error(err));
  //       }
  //     } else {
  //       return Promise.reject(new Error(`no connection open`));
  //     }
  //   }

  //   async changeEncryptionSecret(
  //     passphrase: string,
  //     oldpassphrase: string
  //   ): Promise<void> {
  //     if (!this.native) {
  //       return Promise.reject(
  //         new Error(`Not implemented for ${this.platform} platform`)
  //       );
  //     }
  //     if (this.sqlite != null) {
  //       try {
  //         return Promise.resolve(
  //           await this.sqlite.changeEncryptionSecret(passphrase, oldpassphrase)
  //         );
  //       } catch (err) {
  //         return Promise.reject(new Error(err));
  //       }
  //     } else {
  //       return Promise.reject(new Error(`no connection open`));
  //     }
  //   }

  //   /*** addUpgradeStatement
  //    * @param database
  //    * @param fromVersion
  //    * @param toVersion
  //    * @param statement
  //    * @param set
  //    */
  //   async addUpgradeStatement(
  //     database: string,
  //     fromVersion: number,
  //     toVersion: number,
  //     statement: string,
  //     set?: capSQLiteSet[]
  //   ): Promise<void> {
  //     if (this.sqlite != null) {
  //       try {
  //         await this.sqlite.addUpgradeStatement(
  //           database,
  //           fromVersion,
  //           toVersion,
  //           statement,
  //           set ? set : []
  //         );
  //         return Promise.resolve();
  //       } catch (err) {
  //         return Promise.reject(new Error(err));
  //       }
  //     } else {
  //       return Promise.reject(new Error(`no connection open for ${database}`));
  //     }
  //   }
  //   /* * Create a connection to a database
  //    * @param database
  //    * @param encrypted
  //    * @param mode
  //    * @param version
  //    */
  //   async createConnection(
  //     database: string,
  //     encrypted: boolean,
  //     mode: string,
  //     version: number
  //   ): Promise<SQLiteDBConnection> {
  //     if (this.sqlite != null) {
  //       try {
  //         const db: SQLiteDBConnection = await this.sqlite.createConnection(
  //           database,
  //           encrypted,
  //           mode,
  //           version
  //         );
  //         if (db != null) {
  //           console.log(db);
  //           return Promise.resolve(db);
  //         } else {
  //           return Promise.reject(new Error(`no db returned is null`));
  //         }
  //       } catch (err) {
  //         return Promise.reject(new Error(err));
  //       }
  //     } else {
  //       return Promise.reject(new Error(`no connection open for ${database}`));
  //     }
  //   }
  //   /*
  //    * Close a connection to a database
  //    * @param database
  //    */
  //   async closeConnection(database: string): Promise<void> {
  //     if (this.sqlite != null) {
  //       try {
  //         await this.sqlite.closeConnection(database);
  //         return Promise.resolve();
  //       } catch (err) {
  //         return Promise.reject(new Error(err));
  //       }
  //     } else {
  //       return Promise.reject(new Error(`no connection open for ${database}`));
  //     }
  //   }
  //   /*
  //    * Retrieve an existing connection to a database
  //    * @param database
  //    */
  //   async retrieveConnection(database: string): Promise<SQLiteDBConnection> {
  //     if (this.sqlite != null) {
  //       try {
  //         return Promise.resolve(await this.sqlite.retrieveConnection(database));
  //       } catch (err) {
  //         return Promise.reject(new Error(err));
  //       }
  //     } else {
  //       return Promise.reject(new Error(`no connection open for ${database}`));
  //     }
  //   }
  //   /**
  //    * Retrieve all existing connections
  //    */
  //   async retrieveAllConnections(): Promise<Map<string, SQLiteDBConnection>> {
  //     if (this.sqlite != null) {
  //       try {
  //         const myConns = await this.sqlite.retrieveAllConnections();
  //         /*                let keys = [...myConns.keys()];
  //                 keys.forEach( (value) => {
  //                     console.log("Connection: " + value);
  //                 });
  // */
  //         return Promise.resolve(myConns);
  //       } catch (err) {
  //         return Promise.reject(new Error(err));
  //       }
  //     } else {
  //       return Promise.reject(new Error(`no connection open`));
  //     }
  //   }
  //   /**
  //    * Close all existing connections
  //    */
  //   async closeAllConnections(): Promise<void> {
  //     if (this.sqlite != null) {
  //       try {
  //         return Promise.resolve(await this.sqlite.closeAllConnections());
  //       } catch (err) {
  //         return Promise.reject(new Error(err));
  //       }
  //     } else {
  //       return Promise.reject(new Error(`no connection open`));
  //     }
  //   }
  //   /*
  //    * Check if connection exists
  //    * @param database
  //    */
  //   async isConnection(database: string): Promise<capSQLiteResult> {
  //     if (this.sqlite != null) {
  //       try {
  //         return Promise.resolve(await this.sqlite.isConnection(database));
  //       } catch (err) {
  //         return Promise.reject(new Error(err));
  //       }
  //     } else {
  //       return Promise.reject(new Error(`no connection open`));
  //     }
  //   }
  //   /*
  //    * Check Connections Consistency
  //    * @returns
  //    */
  //   async checkConnectionsConsistency(): Promise<capSQLiteResult> {
  //     if (this.sqlite != null) {
  //       try {
  //         const res = await this.sqlite.checkConnectionsConsistency();
  //         return Promise.resolve(res);
  //       } catch (err) {
  //         return Promise.reject(new Error(err));
  //       }
  //     } else {
  //       return Promise.reject(new Error(`no connection open`));
  //     }
  //   }
  //   /*
  //    * Check if database exists
  //    * @param database
  //    */
  //   async isDatabase(database: string): Promise<capSQLiteResult> {
  //     if (this.sqlite != null) {
  //       try {
  //         return Promise.resolve(await this.sqlite.isDatabase(database));
  //       } catch (err) {
  //         return Promise.reject(new Error(err));
  //       }
  //     } else {
  //       return Promise.reject(new Error(`no connection open`));
  //     }
  //   }
  //   /**
  //    * Get the list of databases
  //    */
  //   async getDatabaseList(): Promise<capSQLiteValues> {
  //     if (this.sqlite != null) {
  //       try {
  //         return Promise.resolve(await this.sqlite.getDatabaseList());
  //       } catch (err) {
  //         return Promise.reject(new Error(err));
  //       }
  //     } else {
  //       return Promise.reject(new Error(`no connection open`));
  //     }
  //   }
  //   /**
  //    * Add "SQLite" suffix to old database's names
  //    */
  //   async addSQLiteSuffix(folderPath?: string): Promise<void> {
  //     if (!this.native) {
  //       return Promise.reject(
  //         new Error(`Not implemented for ${this.platform} platform`)
  //       );
  //     }
  //     if (this.sqlite != null) {
  //       try {
  //         const path: string = folderPath ? folderPath : 'default';
  //         return Promise.resolve(await this.sqlite.addSQLiteSuffix(path));
  //       } catch (err) {
  //         return Promise.reject(new Error(err));
  //       }
  //     } else {
  //       return Promise.reject(new Error(`no connection open`));
  //     }
  //   }
  //   /**
  //    * Delete old databases
  //    */
  //   async deleteOldDatabases(folderPath?: string): Promise<void> {
  //     if (!this.native) {
  //       return Promise.reject(
  //         new Error(`Not implemented for ${this.platform} platform`)
  //       );
  //     }
  //     if (this.sqlite != null) {
  //       try {
  //         const path: string = folderPath ? folderPath : 'default';
  //         return Promise.resolve(await this.sqlite.deleteOldDatabases(path));
  //       } catch (err) {
  //         return Promise.reject(new Error(err));
  //       }
  //     } else {
  //       return Promise.reject(new Error(`no connection open`));
  //     }
  //   }

  //   /*
  //    * Import from a Json Object
  //    * @param jsonstring
  //    */
  //   async importFromJson(jsonstring: string): Promise<capSQLiteChanges> {
  //     if (this.sqlite != null) {
  //       try {
  //         return Promise.resolve(await this.sqlite.importFromJson(jsonstring));
  //       } catch (err) {
  //         return Promise.reject(new Error(err));
  //       }
  //     } else {
  //       return Promise.reject(new Error(`no connection open`));
  //     }
  //   }

  //   /*
  //    * Is Json Object Valid
  //    * @param jsonstring Check the validity of a given Json Object
  //    */

  //   async isJsonValid(jsonstring: string): Promise<capSQLiteResult> {
  //     if (this.sqlite != null) {
  //       try {
  //         return Promise.resolve(await this.sqlite.isJsonValid(jsonstring));
  //       } catch (err) {
  //         return Promise.reject(new Error(err));
  //       }
  //     } else {
  //       return Promise.reject(new Error(`no connection open`));
  //     }
  //   }

  //   /**
  //    * Copy databases from public/assets/databases folder to application databases folder
  //    */
  //   async copyFromAssets(): Promise<void> {
  //     if (this.sqlite != null) {
  //       try {
  //         return Promise.resolve(await this.sqlite.copyFromAssets());
  //       } catch (err) {
  //         return Promise.reject(new Error(err));
  //       }
  //     } else {
  //       return Promise.reject(new Error(`no connection open`));
  //     }
  //   }
}
