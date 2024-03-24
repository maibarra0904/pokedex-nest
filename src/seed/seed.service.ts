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
    const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=500')

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

    return {msg: "500 pokemons created successfully"}
  }

  async executeSpecificSeed(n: number) {
    const {data} = await this.axios.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=${n}`)

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

    return {msg: `${n} pokemons created successfully`}
  }

  async deleteAllSeed(){
    
    try {
      await this.pokemonService.deleteAll();
      return {msg: "All pokemons deleted successfully"}  
    } catch (error) {
      console.log(error);
    }
    

  }    
}
