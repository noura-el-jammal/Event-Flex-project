import { defineStore } from 'pinia';

export const useProgrammeStore = defineStore('programme', {
    state: () => ({
        programmes: [],
        loading: false,
        error: null
    }),

    actions: {
        async fetchProgrammes(eventId) {
            this.loading = true;
            try {
                const response = await axios.get(`/api/evenements/${eventId}/programmes`);
                this.programmes = response.data;
                this.error = null;
            } catch (error) {
                this.error = error.message;
                console.error('Error fetching programmes:', error);
            } finally {
                this.loading = false;
            }
        },

        async addProgramme(eventId, programmeData) {
            this.loading = true;
            try {
                const response = await axios.post(`/api/evenements/${eventId}/programmes`, programmeData);
                this.programmes.push(response.data);
                this.error = null;
                return response.data;
            } catch (error) {
                this.error = error.message;
                console.error('Error adding programme:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateProgramme(programmeId, programmeData) {
            this.loading = true;
            try {
                const response = await axios.put(`/api/programmes/${programmeId}`, programmeData);
                const index = this.programmes.findIndex(p => p.id === programmeId);
                if (index !== -1) {
                    this.programmes[index] = response.data;
                }
                this.error = null;
                return response.data;
            } catch (error) {
                this.error = error.message;
                console.error('Error updating programme:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteProgramme(programmeId) {
            this.loading = true;
            try {
                await axios.delete(`/api/programmes/${programmeId}`);
                this.programmes = this.programmes.filter(p => p.id !== programmeId);
                this.error = null;
            } catch (error) {
                this.error = error.message;
                console.error('Error deleting programme:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        }
    },

    getters: {
        getProgrammesByEvent: (state) => (eventId) => {
            return state.programmes.filter(p => p.id_evenement === eventId);
        },
        
        getProgrammeById: (state) => (programmeId) => {
            return state.programmes.find(p => p.id === programmeId);
        }
    }
}); 