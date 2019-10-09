var apiURL = 'https://data.nantesmetropole.fr/api/records/1.0/search/?dataset=244400404_parkings-publics-nantes'
var headers = { 'Authorization': "4bc56ef82a3b777f22ea2bbe098506752bb72f089a289174b334a46c" }

var app = new Vue({
  el: '#app',
  data: {
    layout: 'tab',
    filterKey: '',
    records: [],
    gridColumns: ['Nom', 'Adresse', 'Places', 'PMR', 'Stationnement velo'],
    gridData : [],
    sortKey: 0,
    sortOrders: [1, 1, 1, 1, 1],
    commits: null
  },
  created: function () {
    this.fetchData()
  },
  computed: {
    filteredTData: function () {
      var sortKey = this.sortKey
      var filterKey = this.filterKey && this.filterKey.toLowerCase()
      var order = this.sortOrders[sortKey] || 1
      var tData = this.gridData
      if (filterKey) {
        tData = tData.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      tData = tData.slice().sort(function (a, b) {
        a = a[sortKey]
        b = b[sortKey]
        return (a === b ? 0 : a > b ? 1 : -1) * order
      })
      return tData
    }
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  methods: {
    sortBy: function (idx) {
      console.log(idx, this.sortOrders[idx])
      this.sortKey = idx
      this.sortOrders[idx] *= -1
    },
    fetchData: function () {
      fetch(apiURL, {
           method: 'GET',
           headers: headers})
      .then(response => response.json())
      .then(data => {
          console.log(data.records)
          this.records = data.records
          var tmpData = []
          data.records.forEach(function(r) {
            var data = []
            data.push(r.fields.nom_complet)
            data.push(r.fields.adresse)
            data.push(r.fields.capacite_voiture)
            data.push(r.fields.capacite_pmr)
            data.push(r.fields.stationnement_velo)

            tmpData.push(data)
          })
          this.gridData = tmpData
      })
    }
  }
})
