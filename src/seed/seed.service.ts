import { Injectable } from '@nestjs/common';
//import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';



@Injectable()
export class SeedService {

  constructor (
    //Agregando la adaptacion para la peticion Axios
    private readonly axiosHttp: AxiosAdapter,

    //Usado para executeSeed
    private pokemonService: PokemonService,

    //Usado para executeSpecificSeed
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>
  ){}

  //private readonly axios: AxiosInstance = axios;
  
  //*** Implementando el seed donde se ejecutan promesas de forma simultanea ***
  //Se agrega cada pokemon a un arreglo de promesas y luego se ejecutan las promesas simultaneamente
  //Se llama a la base de datos para cada pokemon creado, es decir, para ejecutar cada una de las
  //promesas que conforman el arreglo
  async executeSeed() {

    this.deleteAllSeed();

    const data = await this.axiosHttp.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=100')

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

    return {msg: "100 pokemons created successfully"}
  }

  //*** Implementando el seed ejecutando una sola llamada a la base de datos ***
  //Se agrega cada pokemon a un arreglo de objetos (cada objeto representa un pokemon)
  //Luego se llama al metodo de mongo que permite la insercion de varios datos al mismo tiempo
  //Por tanto se llama solo una vez a la base de datos para insertar los pokemons del arreglo
  async executeSpecificSeed(n: number) {

    this.deleteAllSeed();

    const data = await this.axiosHttp.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=${n}`)

    const pokemonToInsert = [];

    data.results.forEach(({name, url}) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];

      pokemonToInsert.push(
        {
          name,
          no
        }
      )
      
    })

    await this.pokemonModel.insertMany(pokemonToInsert)    

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
