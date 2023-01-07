(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function n(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerpolicy&&(o.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?o.credentials="include":r.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(r){if(r.ep)return;r.ep=!0;const o=n(r);fetch(r.href,o)}})();function f(e){let t=[],n=e[0],s=e[0];for(let r of e)r<n?n=r:r>s&&(s=r);return t.push(n),t.push(s),t}function m(e){let t=[];return e.length>4?(t.push(e[e.length-5]),t.push(e[e.length-3])):e.length==4?(t.push(e[0]),t.push(e[e.length-3])):(t.push(e[0]),t.push(e[e.length-1])),t}const y=(e,t,n)=>{let s=m(e),r=f(t);return e.splice(0,e.length),t.splice(0,t.length),`
        <div class="synthese__day">
            <h4 class="synthese__weekday">${n}</h4>
            <div class="synthese__icons">
                <img class="synthese__icon" src=" http://openweathermap.org/img/wn/${s[0]}@2x.png" alt="icone de météo"/>
                <img class="synthese__icon--filtre" src=" http://openweathermap.org/img/wn/${s[1]}@2x.png" alt="icone de météo"/>
            </div>
            <div class="synthese__minmax">
                <p class="synthese__temperature">${Math.round(r[0])}°</p>
                <p class="synthese__temperature--filtre">${Math.round(r[1])}°</p>
            </div>
        </div>
    `},g=e=>`
            <h4 class="previsions__weekday">${e.toLocaleString("fr-FR",{weekday:"long"})}</h4>
            <div class="previsions__divHours"></div>
    `,_=(e,t)=>`
        <div class="previsions__generalParHeure">
            <p class="previsions__heure">${t.getHours()}h</p>
            <img class="previsions__icone" src=" http://openweathermap.org/img/wn/${e.weather[0].icon}@2x.png" alt="icone de météo"/>
            <p class="previsions__t">${Math.round(e.main.temp)}°</p>
            <p class="previsions__descr">${e.weather[0].description}</p>
        </div>
    `,v=e=>{let t=e.lastElementChild.querySelector(".synthese__icon"),n=e.lastElementChild.querySelector(".synthese__icon--filtre"),s=e.lastElementChild.querySelector(".synthese__temperature"),r=e.lastElementChild.querySelector(".synthese__temperature--filtre");t.src==n.src&&(n.style.display="none"),s.textContent==r.textContent&&(r.style.display="none")},D=e=>{let t=document.querySelector(".synthese"),n=document.querySelector(".previsions");for(let s of e.syntheseDays)t.innerHTML+=s,v(t);for(let s of e.daysDetailed)n.appendChild(s)};function w(e){let t=new Date(e.list[0].dt*1e3);t.setHours(t.getUTCHours()+e.city.timezone/3600);let n=t.getDate()-1,s=0,r=t.toLocaleString("fr-FR",{weekday:"long"}),o=[],l=[],u=[],a=[];for(let c of e.list){let i=new Date(c.dt*1e3);if(i.setHours(i.getUTCHours()+e.city.timezone/3600),i.getDate()!=n){if(s>0&&u.push(y(l,o,r)),n+=1,s+=1,s>5)break;let d=document.createElement("div");d.classList.add("previsions__day"),d.innerHTML=g(i),a.push(d)}o.push(c.main.temp),l.push(c.weather[0].icon),r=i.toLocaleString("fr-FR",{weekday:"long"}),a[a.length-1].lastElementChild.innerHTML+=_(c,i)}return s==5&&u.push(y(l,o,r)),{syntheseDays:u,daysDetailed:a}}async function p(){let e=h.value;document.querySelector("#country").value="",document.querySelector(".synthese").innerHTML="",document.querySelector(".previsions").innerHTML="",document.querySelector("h1").textContent=`Météo à ${e}`;try{const n=await(await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${e}&lang=fr&appid=13b1572aa8cbef567b34dcfca12134a7&units=metric`)).json();localStorage.setItem("data",JSON.stringify(n)),D(w(n))}catch{console.log("Erreur : impossible de récupérer les données")}}let S=document.querySelector("button"),h=document.querySelector("#country");S.addEventListener("click",p);h.addEventListener("keyup",e=>{e.code=="Enter"&&p()});
