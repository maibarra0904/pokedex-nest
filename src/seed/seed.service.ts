import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';



@Injectable()
export class SeedService {

  constructor (
    private pokemonService: PokemonService,
  ){}

  private readonly axios: AxiosInstance = axios;

  async executeSeed() {
    const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')

    const insertPromisesArray = [];

    data.results.forEach(({name, url}) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];

      insertPromisesArray.push(
        this.pokemonService.create({
        name,
        no
        })
      )
      
    })

    await Promise.all(insertPromisesArray);    

    return
  }
}
