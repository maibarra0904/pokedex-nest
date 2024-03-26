import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,

    private readonly configService: ConfigService,
  ){
    
    this.defaultLimit = configService.get<number>('defaultLimit');
  }


  async create(createPokemonDto: CreatePokemonDto) {

    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create( createPokemonDto);
    return pokemon;  
    } catch (error) {
      this.handleExceptions(error);
    }
    
  }

  findAll(pagination: PaginationDto) {

    const {limit = this.defaultLimit, offset = 0 } = pagination;

    return this.pokemonModel.find().limit(limit).skip(offset).sort({no: 1});
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    //numero
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({no: term})
    }

    //nombre
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({name: term.toLowerCase().trim()})
    }

    //MongoID
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term)
    }


    if (!pokemon) throw new NotFoundException(`Pokemon with id, name or no "${term}" not found.`);

    return pokemon
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    try {
      if(updatePokemonDto.name) 
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
      await pokemon.updateOne( updatePokemonDto, {new: true});

      return { ...pokemon.toJSON(), ...updatePokemonDto};  
    } catch (error) {
      this.handleExceptions(error, 'Update')
    }
    
  }

  async remove(id: string) {
    const pokemon = await this.findOne(id);
      try {
        console.log(pokemon)
        await pokemon.deleteOne();        
        return {msg: `Removed`}}
       catch (error) {
        this.handleExceptions(error, 'Delete')
      }
      
    }

  async deleteAll() {
    try {
      await this.pokemonModel.deleteMany();
      return {msg: `Deleted`}}
     catch (error) {
      this.handleExceptions(error, 'Delete')
    }
  }
      
  

  private handleExceptions( error: any, type: string = "Create") {
    if (error.code === 11000) {
      switch (type) {
        case 'Create':
          throw new BadRequestException(`Pokemon with ${JSON.stringify(error.keyValue)} exists. Cannot be created`)    
        case 'Update':
          throw new BadRequestException(`Pokemon with ${JSON.stringify(error.keyValue)} exists. Cannot be updated`)    
        case 'Delete':
          break
        default:
          break;
      }
      
     }

     throw new InternalServerErrorException('Cannot access to Pokemon - Check server')
  }
}
