import { Injectable } from '@nestjs/common';
import '@polkadot/api-augment';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@common/config';
import { MemoryStoredFile } from 'nestjs-form-data';
import { NftRepository } from '@modules/app-db/repositories';
const { create } = require('ipfs-http-client');

@Injectable()
export class CollectionCreator {
  constructor(private nftRepo: NftRepository, private configService: ConfigService<AppConfig>) {

  }

  async createCollectionCall(file: MemoryStoredFile, name: string, description: string, address: string, userId: string): Promise<Response> {
    //TBA We check in database if user have already created a collection (If there is collection ID in their user profile)
    //If they have, skip this function and return nothing
    //If they haven't, we create a collection for them

    const user = await this.nftRepo.getUser(userId);
    if (user.collectionID != null) {
      return null;
    }

    let cid = null

    if (file != null) {
      const IPFS_NODE_URL = this.configService.get("IPFS_URL");
      const username = this.configService.get("IPFS_NAME");
      const password = this.configService.get("IPFS_PASSWORD");

      const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');

      const client = create({
        url: IPFS_NODE_URL,
        headers: {
          authorization: auth,
        },
      });

      cid = await client.add(file.buffer);
    }

    const url = this.configService.get("NFT_MODULE_URL");

    let body = null;

    if (cid == null) {
      body = JSON.stringify({
        "owner": address,
        "metadata": {
          "name": name,
          "description": description
        },
      });
    }
    else if (description == null) {
      body = JSON.stringify({
        "owner": address,
        "metadata": {
          "name": name,
          "ipfs": cid
        },
      });
    }
    else if (description == null && cid == null) {
      body = JSON.stringify({
        "owner": address,
        "metadata": {
          "name": name
        },
      });
    }
    else {
      body = JSON.stringify({
        "owner": address,
        "metadata": {
          "name": name,
          "description": description,
          "ipfs": cid
        },
      });
    }

    const response = await fetch(`${url}/collection`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    });

    //Save collection ID to user profile

    return await response.json();
  }

  async updateUserCollectionInDB(userId: string, collectionID: string) {
    //Save collection ID to user profile once they confirm transaction
    return await this.nftRepo.createUserCollection(userId, collectionID);;
  }
}