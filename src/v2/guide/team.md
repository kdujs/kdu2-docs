---
title: Meet the Team
type: guide
order: 801
---

{% raw %}

<script id="kdur-profile-template" type="text/template">
  <div class="kdur">
    <div class="avatar">
      <img k-if="profile.imageUrl"
        :src="profile.imageUrl"
        :alt="profile.name" width=80 height=80>
      <img k-else-if="profile.github"
        :src="'https://github.com/' + profile.github + '.png'"
        :alt="profile.name" width=80 height=80>
      <img k-else-if="profile.twitter"
        :src="'https://avatars.io/twitter/' + profile.twitter"
        :alt="profile.name" width=80 height=80>
    </div>
    <div class="profile">
      <h3 :data-official-title="profile.title">
        {{ profile.name }}
        <sup k-if="profile.title && titleVisible" k-html="profile.title"></sup>
      </h3>
      <dl>
        <template k-if="profile.reposOfficial">
          <dt>Core focus</dt>
          <dd>
            <ul>
              <li k-for="repo in profile.reposOfficial">
                <a :href="githubUrl('kdujs', repo)" target=_blank rel="noopener noreferrer">{{ repo.name || repo }}</a>
              </li>
            </ul>
          </dd>
        </template>
        <template k-if="profile.github && profile.reposPersonal">
          <dt>Ecosystem</dt>
          <dd>
            <ul>
              <li k-for="repo in profile.reposPersonal">
                <a :href="githubUrl(profile.github, repo)" target=_blank rel="noopener noreferrer">{{ repo.name || repo }}</a>
              </li>
            </ul>
          </dd>
        </template>
        <template k-if="profile.work">
          <dt>
            <i class="fa fa-briefcase"></i>
            <span class="sr-only">Work</span>
          </dt>
          <dd k-html="workHtml"></dd>
        </template>
        <span k-if="profile.distanceInKm" class="distance">
          <dt>
            <i class="fa fa-map-marker"></i>
            <span class="sr-only">Distance</span>
          </dt>
          <dd>
            About
            <span
              k-if="profile.distanceInKm <= 150"
              :title="profile.name + ' is close enough to commute to your location.'"
              class="user-match"
            >{{ textDistance }} away</span>
            <template k-else>{{ textDistance }} away</template>
            in {{ profile.city }}
          </dd>
        </span>
        <template k-else-if="profile.city">
          <dt>
            <i class="fa fa-map-marker"></i>
            <span class="sr-only">City</span>
          </dt>
          <dd>
            {{ profile.city }}
          </dd>
        </template>
        <template k-if="profile.languages">
          <dt>
            <i class="fa fa-globe"></i>
            <span class="sr-only">Languages</span>
          </dt>
          <dd k-html="languageListHtml" class="language-list"></dd>
        </template>
        <template k-if="profile.links">
          <dt>
            <i class="fa fa-link"></i>
            <span class="sr-only">Links</span>
          </dt>
          <dd>
            <ul>
              <li k-for="link in profile.links">
                <a :href="link" target=_blank>{{ minimizeLink(link) }}</a>
              </li>
            </ul>
          </dd>
        </template>
        <footer k-if="hasSocialLinks" class="social">
          <a class=github k-if="profile.github" :href="githubUrl(profile.github)">
            <i class="fa fa-github"></i>
            <span class="sr-only">Github</span>
          </a>
          <a class=facebook k-if="profile.facebook" :href="'https://www.facebook.com/' + profile.facebook">
            <i class="fa fa-facebook"></i>
            <span class="sr-only">Facebook</span>
          </a>
          <a class=twitter k-if="profile.twitter" :href="'https://twitter.com/' + profile.twitter">
            <i class="fa fa-twitter"></i>
            <span class="sr-only">Twitter</span>
          </a>
          <a class=codepen k-if="profile.codepen" :href="'https://codepen.io/' + profile.codepen">
            <i class="fa fa-codepen"></i>
            <span class="sr-only">CodePen</span>
          </a>
          <a class=linkedin k-if="profile.linkedin" :href="'https://www.linkedin.com/in/' + profile.linkedin">
            <i class="fa fa-linkedin"></i>
            <span class="sr-only">LinkedIn</span>
          </a>
        </footer>
      </dl>
    </div>
  </div>
</script>

<div id="team-members">
  <div class="team">

    <h2 id="active-core-team-members">
      Active Core Team Members
      <button
        k-if="geolocationSupported && !userPosition"
        @click="getUserPosition"
        :disabled="isSorting"
        class="sort-by-distance-button"
      >
        <i
          k-if="isSorting"
          class="fa fa-refresh rotating-clockwise"
        ></i>
        <template k-else>
          <i class="fa fa-map-marker"></i>
          <span>find near me</span>
        </template>
      </button>
    </h2>

    <p k-if="errorGettingLocation" class="tip">
      Failed to get your location.
    </p>

    <p>
      The development of Kdu and its ecosystem is guided by an international team, some of whom have chosen to be featured below.
    </p>

    <p k-if="userPosition" class="success">
      The core team has been sorted by their distance from you.
    </p>

    <kdur-profile
      k-for="profile in sortedTeam"
      :key="profile.name"
      :profile="profile"
      :title-visible="titleVisible"
    ></kdur-profile>

  </div>

  <div class="team">
    <h2 id="core-team-emeriti">
      Core Team Emeriti
    </h2>

    <p>
      Here we honor some no-longer-active core team members who have made valuable contributions in the past.
    </p>

    <kdur-profile
      k-for="profile in teamEmeriti"
      :key="profile.name"
      :profile="profile"
      :title-visible="titleVisible"
    ></kdur-profile>

  </div>

  <div class="team">
    <h2 id="community-partners">
      Community Partners
      <button
        k-if="geolocationSupported && !userPosition"
        @click="getUserPosition"
        :disabled="isSorting"
        class="sort-by-distance-button"
      >
        <i
          k-if="isSorting"
          class="fa fa-refresh rotating-clockwise"
        ></i>
        <template k-else>
          <i class="fa fa-map-marker"></i>
          <span>find near me</span>
        </template>
      </button>
    </h2>

    <p k-if="errorGettingLocation" class="tip">
      Failed to get your location.
    </p>

    <p>
      Some members of the Kdu community have so enriched it, that they deserve special mention. We've developed a more intimate relationship with these key partners, often coordinating with them on upcoming features and news.
    </p>

    <p k-if="userPosition" class="success">
      The community partners have been sorted by their distance from you.
    </p>

    <kdur-profile
      k-for="profile in sortedPartners"
      :key="profile.name"
      :profile="profile"
      :title-visible="titleVisible"
    ></kdur-profile>

  </div>
</div>

<script>
(function () {
  var cityCoordsFor = {
    'Thị trấn Vạn Giã, Vạn Ninh, Khánh Hòa': [12.6893757, 109.2225701]
  }
  var languageNameFor = {
    en: 'English',
    vi: 'Tiếng Việt'
  }

  var team = [{
    name: 'Nguyễn Khánh Duy',
    title: 'Benevolent Dictator For Life',
    city: 'Thị trấn Vạn Giã, Vạn Ninh, Khánh Hòa',
    languages: ['vi', 'en'],
    github: 'khanhduy1407',
    facebook: 'khanhduy1407',
    work: {
      role: 'Creator',
      org: 'Kdu.js'
    },
    reposOfficial: [
      'kdujs/*'
    ],
    links: [
      'https://www.patreon.com/nkduy_dev'
    ]
  }]

  team = team.concat(shuffle([]))

  var emeriti = shuffle([])

  var partners = []

  Kdu.component('kdur-profile', {
    template: '#kdur-profile-template',
    props: {
      profile: Object,
      titleVisible: Boolean
    },
    computed: {
      workHtml: function () {
        var work = this.profile.work
        var html = ''
        if (work.orgUrl) {
          html += '<a href="' + work.orgUrl + '" target="_blank" rel="noopener noreferrer">'
          if (work.org) {
            html += work.org
          } else {
            this.minimizeLink(work.orgUrl)
          }
          html += '</a>'
        } else if (work.org) {
          html += work.org
        }
        if (work.role) {
          if (html.length > 0) {
            html = work.role + ' @ ' + html
          } else {
            html = work.role
          }
        }
        return html
      },
      textDistance: function () {
        var distanceInKm = this.profile.distanceInKm || 0
        if (this.$root.useMiles) {
          return roundDistance(kmToMi(distanceInKm)) + ' miles'
        } else {
          return roundDistance(distanceInKm) + ' km'
        }
      },
      languageListHtml: function () {
        var vm = this
        var nav = window.navigator
        if (!vm.profile.languages) return ''
        var preferredLanguageCode = nav.languages
          // The preferred language set in the browser
          ? nav.languages[0]
          : (
              // The system language in IE
              nav.userLanguage ||
              // The language in the current page
              nav.language
            )
        return (
          '<ul><li>' +
          vm.profile.languages.map(function (languageCode, index) {
            var language = languageNameFor[languageCode]
            if (
              languageCode !== 'en' &&
              preferredLanguageCode &&
              languageCode === preferredLanguageCode.slice(0, 2)
            ) {
              return (
                '<span ' +
                  'class="user-match" ' +
                  'title="' +
                    vm.profile.name +
                    ' can give technical talks in your preferred language.' +
                  '"' +
                '\>' + language + '</span>'
              )
            }
            return language
          }).join('</li><li>') +
          '</li></ul>'
        )
      },
      hasSocialLinks: function () {
        return this.profile.github || this.profile.twitter || this.profile.codepen || this.profile.linkedin
      }
    },
    methods: {
      minimizeLink: function (link) {
        return link
          .replace(/^https?:\/\/(www\.)?/, '')
          .replace(/\/$/, '')
          .replace(/^mailto:/, '')
      },
      /**
       * Generate a GitHub URL using a repo and a handle.
       */
      githubUrl: function (handle, repo) {
        if (repo && repo.url) {
          return repo.url
        }
        if (repo && repo.indexOf('/') !== -1) {
          // If the repo name has a slash, it must be an organization repo.
          // In such a case, we discard the (personal) handle.
          return (
            'https://github.com/' +
            repo.replace(/\/\*$/, '')
          )
        }
        return 'https://github.com/' + handle + '/' + (repo || '')
      }
    }
  })

  new Kdu({
    el: '#team-members',
    data: {
      team: team,
      teamEmeriti: emeriti,
      partners: shuffle(partners),
      geolocationSupported: false,
      isSorting: false,
      errorGettingLocation: false,
      userPosition: null,
      useMiles: false,
      konami: {
        position: 0,
        code: [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]
      }
    },
    computed: {
      sortedTeam: function () {
        return this.sortKdursByDistance(this.team)
      },
      sortedPartners: function () {
        return this.sortKdursByDistance(this.partners)
      },
      titleVisible: function () {
        return this.konami.code.length === this.konami.position
      }
    },
    created: function () {
      var nav = window.navigator
      if ('geolocation' in nav) {
        this.geolocationSupported = true
        var imperialLanguageCodes = [
          'en-US', 'en-MY', 'en-MM', 'en-BU', 'en-LR', 'my', 'bu'
        ]
        if (imperialLanguageCodes.indexOf(nav.language) !== -1) {
          this.useMiles = true
        }
      }
      document.addEventListener('keydown', this.konamiKeydown)
    },
    beforeDestroy: function () {
      document.removeEventListener('keydown', this.konamiKeydown)
    },
    methods: {
      getUserPosition: function () {
        var vm = this
        var nav = window.navigator
        vm.isSorting = true
        nav.geolocation.getCurrentPosition(
          function (position) {
            vm.userPosition = position
            vm.isSorting = false
          },
          function (error) {
            vm.isSorting = false
            vm.errorGettingLocation = true
          },
          {
            enableHighAccuracy: true
          }
        )
      },
      sortKdursByDistance: function (kdurs) {
        var vm = this
        if (!vm.userPosition) return kdurs
        var kdursWithDistances = kdurs.map(function (kdur) {
          var cityCoords = cityCoordsFor[kdur.city]
          if (cityCoords) {
            return Object.assign({}, kdur, {
              distanceInKm: getDistanceFromLatLonInKm(
                vm.userPosition.coords.latitude,
                vm.userPosition.coords.longitude,
                cityCoords[0],
                cityCoords[1]
              )
            })
          }
          return Object.assign({}, kdur, {
            distanceInKm: null
          })
        })
        kdursWithDistances.sort(function (a, b) {
          if (a.distanceInKm && b.distanceInKm) return a.distanceInKm - b.distanceInKm
          if (a.distanceInKm && !b.distanceInKm) return -1
          if (!a.distanceInKm && b.distanceInKm) return 1
          if (a.name < b.name) return -1
          if (a.name > b.name) return 1
        })
        return kdursWithDistances
      },
      konamiKeydown: function (event) {
        if (this.titleVisible) {
          return
        }

        if (event.keyCode !== this.konami.code[this.konami.position++]) {
          this.konami.position = 0
        }
      }
    }
  })

  /**
  * Shuffles array in place.
  * @param {Array} a items The array containing the items.
  */
  function shuffle (a) {
    a = a.concat([])
    if (window.location.hostname === 'localhost') {
      return a
    }
    var j, x, i
    for (i = a.length; i; i--) {
      j = Math.floor(Math.random() * i)
      x = a[i - 1]
      a[i - 1] = a[j]
      a[j] = x
    }
    return a
  }

  /**
  * Calculates great-circle distances between the two points – that is, the shortest distance over the earth’s surface – using the Haversine formula.
  * @param {Number} lat1 The latitude of the 1st location.
  * @param {Number} lon1 The longitute of the 1st location.
  * @param {Number} lat2 The latitude of the 2nd location.
  * @param {Number} lon2 The longitute of the 2nd location.
  */
  function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371 // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1)  // deg2rad below
    var dLon = deg2rad(lon2-lon1)
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    var d = R * c // Distance in km
    return d
  }

  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  function kmToMi (km) {
    return km * 0.62137
  }

  function roundDistance (num) {
    return Number(Math.ceil(num).toPrecision(2))
  }
})()
</script>

{% endraw %}
