import * as SecureStore from 'expo-secure-store';
import dayjs from 'dayjs';
import { AgendaEvent } from '../data/mockEvents';

// SUBSTITUA PELA URL DO SEU APP BUBBLE (Ex: https://meuapp.bubbleapps.io)
const BUBBLE_BASE_URL = 'https://camarote-shows-web-73474.bubbleapps.io/version-test';
const API_VERSION = 'api/1.1';

export interface BubbleUser {
  id: string;
  email: string;
  token: string;
}

export const BubbleService = {
  /**
   * Realiza login no Bubble via Data API
   */
  async login(email: string, password: string): Promise<BubbleUser> {
    const url = `${BUBBLE_BASE_URL}/${API_VERSION}/login`;
    console.log('Tentando login em:', url);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Resposta não-JSON recebida:', text.substring(0, 100)); // Log parcial para não poluir
        throw new Error(`O servidor na URL [${url}] retornou uma resposta inválida (página HTML). Verifique se a URL da API está correta e se a "Data API" está ativada no Bubble.`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Erro ao realizar login');
      }

      const user: BubbleUser = {
        id: data.user_id,
        email: email,
        token: data.token,
      };

      // Salva token com segurança
      await SecureStore.setItemAsync('user_token', user.token);
      await SecureStore.setItemAsync('user_id', user.id);

      return user;
    } catch (error: any) {
      console.error('Login Error:', error);
      throw error;
    }
  },

  /**
   * Busca eventos da tabela 'eventos' no Bubble e mapeia para o formato do App
   */
  async fetchEvents(token: string): Promise<AgendaEvent[]> {
    const url = `${BUBBLE_BASE_URL}/${API_VERSION}/obj/eventos`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Resposta não-JSON em fetchEvents:', text.substring(0, 100));
        throw new Error(`Erro ao buscar eventos: O servidor na URL [${url}] retornou HTML. Verifique se o objeto "eventos" está exposto na Data API do Bubble.`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Erro ao buscar eventos');
      }

      // Bubble retorna os objetos dentro de 'response.results'
      const results = data.response.results || [];

      // Mapeamento de campos do Bubble para o App
      return results.map((item: any) => ({
        id: item['unique id'] || item['_id'],
        title: item['nome_evento'] || 'Sem título',
        date: item['data_hora_inicio'] ? dayjs(item['data_hora_inicio']).format('YYYY-MM-DD') : '',
        startTime: item['data_hora_inicio'] ? dayjs(item['data_hora_inicio']).format('HH:mm') : '00:00',
        endTime: item['data_hora_fim'] ? dayjs(item['data_hora_fim']).format('HH:mm') : '23:59',
        category: item['Status Contratante'] || 'Pendente',
        location: item['local_evento'] || '',
        description: item['informacoes'] || '',
        // Outros campos úteis
        cidade: item['cidade'],
        estado: item['estado'],
        contratante: item['contratante'],
      }));
    } catch (error: any) {
      console.error('Fetch Events Error:', error);
      throw error;
    }
  },

  /**
   * Verifica se há um token salvo e retorna
   */
  async getSavedToken() {
    return await SecureStore.getItemAsync('user_token');
  },

  /**
   * Remove credenciais ao sair
   */
  async logout() {
    await SecureStore.deleteItemAsync('user_token');
    await SecureStore.deleteItemAsync('user_id');
  }
};
