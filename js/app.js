let app = new Vue({
    el: '#app',
    data: {
        lastUrl: 'INITIAL JUNK',
        rawUrl: '',
        validUrl: null,
        hosts: [
            {
                slug: 'dtrpg',
                name: 'Drive Thru RPG',
                domain: 'www.drivethrurpg.com',
                regex: /(www)?\.drivethrurpg\.com/
            },
            {
                slug: 'stv',
                name: 'Storyteller\'s Vault',
                domain: 'www.storytellersvault.com',
                regex: /(www)?\.storytellersvault\.com/
            }
        ],
        affiliates: [
            {
                slug: 'mage-the-podcast',
                website: 'http://magethepodcast.com/',
                name: 'Mage: The Podcast',
                affiliateId: '11172',
                preppedUrl: null
            },
            {
                slug: 'exaltcast',
                website: 'http://www.exaltcast.com/',
                name: 'Systematic Understanding of Everything',
                affiliateId: '2672313',
                preppedUrl: null
            },
            {
                slug: 'story-told',
                website: 'https://thestorytold.libsyn.com/',
                name: 'The Story Told',
                affiliateId: '1373',
                preppedUrl: null
            },
            {
                slug: 'werewolf-the-podcast',
                website: 'https://keepontheheathlands.podbean.com/',
                name: 'Werewolf: The Podcast',
                affiliateId: '235787',
                preppedUrl: null
            },
        ]
    },
    methods: {
        getHostAndAffiliate: function (sourceUrl) {
            let parsed = new URL(sourceUrl);
            let theHost = this.hosts.find(h => h.regex.test(parsed.host));
            let curr_affiliate = parsed.searchParams.getAll('affiliate_id');
            let theAff = null;
            if (curr_affiliate.length) {
                if (curr_affiliate.length === 1) {
                    console.log(curr_affiliate[0])
                    theAff = this.affiliates.find(a => a.affiliateId == curr_affiliate[0])
                }
            }
            return {
                host: this._dupHost(theHost),
                affiliate: this._dupAff(theAff),
            }
        },
        // getDtrpg: function () {
        //     let { host, affiliate } = this.getHostAndAffiliate('https://www.drivethrurpg.com/product/55410/Manual-of-Exalted-Power-Abyssals?affiliate_id=11172');
        //     this.copyText(affiliate.name);
        // },
        // getStoryteller: function () {
        //     let { host, affiliate } = this.getHostAndAffiliate('https://www.drivethrurpg.com/product/55410/Manual-of-Exalted-Power-Abyssals?affiliate_id=2672313');
        //     this.copyText(affiliate.name);
        // },
        copyText: function (txt) {
            navigator.clipboard.writeText(txt);
        },
        rawUrlChange: function(){
            console.log(this.rawUrl);
            this.lastUrl = this.rawUrl;
            try{
                let parsed = new URL(this.rawUrl);
                this.validUrl = true;
                this.affiliates.forEach((a) => a.preppedUrl = this.getProcessedUrl(a.affiliateId, this.rawUrl));
            } catch {
                this.validUrl = false;
                console.log('UH OH!')
            }
        },
        getProcessedUrl: function(affiliateId, sourceUrl){
            let parsed = new URL(sourceUrl);
            parsed.searchParams.delete('affiliate_id');
            parsed.searchParams.append('affiliate_id', affiliateId)
            return parsed.toString();
        },
        _dupHost: (host) => ({
            slug: host.slug,
            name: host.name,
            domain: host.domain,
            regex: host.regex
        }),
        _dupAff: (aff) => ({
            slug: aff.slug,
            name: aff.name,
            affiliateId: aff.affiliateId
        })
    }
})
