import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearApiResponse } from '../features/relations/apiRelationsSlice';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import FontAwesome CSS

const GenerateGraphButton = () => {
  const dispatch = useDispatch();
  const apiStatus = useSelector((state) => state.apiRelations.apiStatus);
  const apiResponse = useSelector((state) => state.apiRelations.apiResponse);
  const error = useSelector((state) => state.apiRelations.error);
  

  // Unicode for FontAwesome icons
  const relationIcons = {
    "alma_mater": "\uf19d", // Graduation cap icon
    "born_in": "\uf015", // Home icon
    "has_father": "\uf183", // Male user icon
    "has_siblings": "\uf0c0", // Users icon
    "has_son": "\uf183", // Male user icon (reuse)
    "has_wife": "\uf182", // Female user icon
    "is_chief_of": "\uf19c", // Building icon
    "is_founder_of": "\uf0c1", // Link icon
    "responsible_for": "\uf0e7", // Bolt icon
    "reward_by": "\uf024", // Flag icon
    "alias": "\uf2c3", // Information circle icon
    "colour_of_eyes": "\uf06e", // Eye icon
    "colour_of_hair": "\uf06e", // Eye icon (reuse)
    "criminal_charges": "\uf0e7", // Bolt icon (reuse)
    "date_of_arrest": "\uf073", // Calendar icon
    "date_of_birth": "\uf073", // Calendar icon (reuse)
    "known_languages": "\uf0ac", // Globe icon
    "nationality": "\uf024", // Flag icon (reuse)
    "is_employee_of": "\uf19c", // Building icon (reuse)
    "countries_of_residence": "\uf0ac", // Globe icon (reuse)
    "title": "\uf2b9", // Id badge icon
    "founded": "\uf058", // Check-circle icon
    "date_of_death": "\uf071", // Exclamation-triangle icon
    "religion": "\uf6d0", // Praying hands icon
    "has_daughter": "\uf183", // Female user icon (reuse)
    "has_mother": "\uf182", // Female user icon (reuse)
    "has_lawyer": "\uf0e3", // Gavel icon
    "influenced": "\uf005", // Star icon
    "inspired_by": "\uf005", // Star icon (reuse)
    "supporter_of": "\uf25a", // Heart icon
    "wanted_by": "\uf21e", // Crosshairs icon
    "awards": "\uf091", // Trophy icon
    "educational_qualification": "\uf19d", // Graduation cap icon (reuse)
    "gender": "\uf228", // Mars symbol (for male)
    "occupation": "\uf0b1", // Briefcase icon
    "social_media_accounts": "\uf099", // Twitter icon (example)
    "age_at_the_time_of_death": "\uf071", // Exclamation-triangle icon (reuse)
    "lives_in": "\uf015", // Home icon (reuse)
    "stateorprovinces_of_residence": "\uf0ac", // Globe icon (reuse)
  };

  const handleGenerateGraph = () => {
    if (apiResponse) {
      const graphWindow = window.open('', '_blank');
      console.log("meow", apiResponse);

      // Create the HTML content for the new window, including the necessary scripts
      graphWindow.document.write(`
        <html>
          <head>
            <title>Graph</title>
            <script src="https://d3js.org/d3.v7.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/save-svg-as-png@1.4.17/lib/saveSvgAsPng.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.0/gsap.min.js"></script> <!-- GSAP CDN -->
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">

            <style>
             @font-face {
                font-family: 'FontAwesome';
                src: url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/webfonts/fa-solid-900.woff2') format('woff2');
                font-weight: 900;
                font-style: normal;
                font-display: swap;
              }

              .sidebar {
                position: fixed;
                top: 0;
                right: 0;
                width: 300px;
                height: 100vh;
                background-color: #f4f4f4;
                box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
                overflow: hidden;
                transform: translateX(100%); /* Sidebar starts off-screen */
              }

              .toggle-button {
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 1000;
                padding: 10px;
                background-color: #007BFF;
                color: #fff;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                transform-origin: center;
              }

              .sidebar-header {
                padding: 15px;
                background-color: #007BFF;
                color: #fff;
                text-align: center;
                font-weight: bold;
                box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
              }

              .sidebar-content {
                padding: 10px;
                display: flex;
                flex-direction: column;
                gap: 10px;
              }

              .node-type-info {
                margin: 10px 0;
                display: flex;
                align-items: center;
                gap: 10px;
              }

              .node-visual {
                display: flex;
                align-items: center;
                gap: 10px;
              }

              .profile-node-visual {
                width: 50px;
                height: 30px;
                background-color: orange;
                border-radius: 50%;
              }

              .focused-profile-node-visual {
                width: 50px; /* Adjust as needed to match your design */
                height: 30px; /* Adjust as needed */
                background-color: orange;
                border-radius: 50%;
                display: inline-block;
                box-shadow: 0 0 20px 10px rgba(255, 0, 0, 0.4); /* Outer glow */
                transition: box-shadow 0.3s ease-in-out;
              }  


              .entity-node-visual {
                width: 50px;
                height: 30px;
                background-color: #69b3a2;
                border-radius: 50%;
              }

              .extra-info {
                border: 1px;              
              }

              .export-button {
                display: flex;
                flex-direction: column;
                gap: 10px;
              }

              .button-style {
                padding: 10px 20px;
                font-size: 16px;
                background-color: #007BFF;
                color: #fff;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
              }

              .profile-node {
                fill: orange;
              }

              .entity-node {
                fill: #69b3a2;
              }

              .related-glow {
                filter: drop-shadow(0 0 10px red);
              }

              text {
                font-family: 'Times New Roman', Times, serif, 'Font Awesome 6 Free', FontAwesome;
                font-weight: 400; /* Use 100 for normal text and 900 for solid icons */
              }

              .fa-icon {
                font-family: 'Font Awesome 6 Free', FontAwesome; /* Explicitly use FontAwesome for icons */
                font-weight: 900; /* Required for FontAwesome 6 solid icons */
              }
            </style>
          </head>
          <body>
            <button id="toggleSidebar" class="toggle-button">☰</button>
            <div class="sidebar" id="sidebar">
              <div class="sidebar-header">
                <h2>Graph Information</h2>
              </div>
              <div class="sidebar-content">
                <div class="node-type-info">
                  <div class="node-visual">
                    <div class="profile-node-visual"></div>
                    <strong>Profile Node:</strong>
                  </div>
                  <p>Represents individuals with known relations.</p>
                </div>
                <div class="node-type-info">
                  <div class="node-visual">
                    <div class="focused-profile-node-visual"></div>
                    <strong>Focused Node:</strong>
                  </div>
                  <p>Highlighted due to significant connections with other profile nodes, indicating key relationships.</p>
                </div>
                <div class="node-type-info">
                  <div class="node-visual">
                    <div class="entity-node-visual"></div>
                    <strong>Entity Node:</strong>
                  </div>
                  <p>Represents related entities (e.g., locations, occupations).</p>
                </div>
                <div class="export-button">
                  <button onclick="exportAsImage()" class="button-style">Export as PNG</button>
                  <button onclick="exportAsPdf()" class="button-style">Export as PDF</button>
                </div>
              </div>
            </div>

            <script>
              // Sidebar toggle functionality
              const sidebar = document.getElementById('sidebar');
              const toggleButton = document.getElementById('toggleSidebar');
              let sidebarOpen = false;

              toggleButton.addEventListener('click', () => {
                if (!sidebarOpen) {
                  // Open sidebar animation using GSAP
                  gsap.to(sidebar, { x: 0, autoAlpha: 1, duration: 0.5, ease: 'power2.out' });
                } else {
                  // Close sidebar animation using GSAP
                  gsap.to(sidebar, { x: '100%', autoAlpha: 0, duration: 0.5, ease: 'power2.in' });
                }

                // GSAP animation for the button (rotate and scale)
                gsap.fromTo(
                  toggleButton,
                  { rotation: 0, scale: 1 },
                  { rotation: 180, scale: 1.2, duration: 0.3, ease: 'power2.out' }
                );

                sidebarOpen = !sidebarOpen;
              });

              window.addEventListener('load', function () {
                document.fonts.ready.then(() => {
                  const { saveSvgAsPng, svgAsPngUri } = window;
                  const width = 1600;
                  const height = 1600;
  
                  const svg = d3.select('body').append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .style('border', '1px solid black');
  
                  const relationIcons = ${JSON.stringify(relationIcons)};
  
                  const preprocessData = (data) => {
                    return data.profile.map(person => {
                      const uniqueRelations = {};
                      person.relations.forEach(relation => {
                        const key = relation.relation;
                        if (uniqueRelations[key]) {
                          uniqueRelations[key].entities = Array.from(new Set([...uniqueRelations[key].entities, ...relation.entities]));
                          uniqueRelations[key].status = Array.from(new Set([...uniqueRelations[key].status, relation.status]));
                        } else {
                          uniqueRelations[key] = { ...relation };
                        }
                      });
                      return {
                        ...person,
                        relations: Object.values(uniqueRelations),
                      };
                    });
                  };
  
                  const jsonData = { profile: preprocessData(${JSON.stringify(apiResponse)}) };
  
                  const extractProfileNames = (data) => {
                    return data.profile.map(person => person.name);
                  };
  
                  const findProfilesWithRelationsToOtherProfiles = (data) => {
                    const profileNames = extractProfileNames(data);
                    const profilesWithRelations = [];
                    
                    data.profile.forEach(person => {
                      let hasRelationWithAnotherProfile = false;
                      
                      person.relations.forEach(relation => {
                        relation.entities.forEach(entity => {
                          if (profileNames.includes(entity)) {
                            hasRelationWithAnotherProfile = true;
                          }
                        });
                      });
  
                      if (hasRelationWithAnotherProfile) {
                        profilesWithRelations.push(person.name);
                      }
                    });
  
                    return profilesWithRelations;
                  };
  
                  const relatedProfiles = findProfilesWithRelationsToOtherProfiles(jsonData);
  
                  const extractRelations = (data, profileName) => {
                    const profile = data.profile.find(person => person.name === profileName);
                    if (!profile) return { nodes: [], links: [] };
  
                    const nodes = [{ id: profile.name, type: 'profile', relation: 'profile', hasProfileRelation: false }];
                    const links = [];
                    const entityRelations = {};
  
                    profile.relations.forEach(relation => {
                      relation.entities.forEach(entity => {
                        const isProfile = data.profile.some(person => person.name === entity);
  
                        if (!nodes.find(node => node.id === entity)) {
                          nodes.push({
                            id: entity,
                            type: isProfile ? 'profile' : 'entity',
                            relation: relation.relation,
                            hasProfileRelation: isProfile
                          });
                        }
  
                        if (entityRelations[entity]) {
                          entityRelations[entity].push(relation.relation);
                        } else {
                          entityRelations[entity] = [relation.relation];
                        }
                      });
                    });
  
                    Object.keys(entityRelations).forEach(entity => {
                      links.push({
                        source: profile.name,
                        target: entity,
                        relation: entityRelations[entity].join(', ')
                      });
                    });
  
                    return { nodes, links };
                  };
  
                  const selectedProfiles = [];
                  const graphData = { nodes: [], links: [] };
  
                  const updateGraph = () => {
                    const { nodes, links } = selectedProfiles.reduce((acc, profile) => {
                      const { nodes, links } = extractRelations(jsonData, profile);
                      nodes.forEach(node => {
                        if (!acc.nodes.find(n => n.id === node.id)) {
                          acc.nodes.push(node);
                        }
                      });
                      acc.links.push(...links);
                      return acc;
                    }, { nodes: extractProfileNames(jsonData).map(name => ({ id: name, type: 'profile' })), links: [] });
  
                    const simulation = d3.forceSimulation(nodes)
                      .force('link', d3.forceLink(links).id(d => d.id).strength(0.5).distance(400))
                      .force('charge', d3.forceManyBody().strength(d => {
                        if (d.type === 'profile' && selectedProfiles.length > 0) {
                          return selectedProfiles.includes(d.id) ? -200 : -100;
                        }
                        return -30;
                      }))
                      .force('center', d3.forceCenter(width / 2, height / 2))
                      .force('collide', d3.forceCollide().radius(30).strength(0.5));
  
                     if (selectedProfiles.length > 0) {
                      const centerX = width / 2;
                      const centerY = height / 2;

                    // Define the radius of the circular layout for multiple expanded nodes
                    const radius = Math.min(width, height) / 4; // Adjust radius as needed
  
                    // Calculate angles to distribute nodes evenly around the circle
                   const angleStep = (2 * Math.PI) / selectedProfiles.length;

                  // Apply radial layout for multiple expanded nodes
                    simulation
                      .force('x', d3.forceX().x((d, i) => {
                      if (selectedProfiles.includes(d.id)) {
                 // Calculate position for each expanded node around a circle
                    const index = selectedProfiles.indexOf(d.id);
                    const angle = index * angleStep;
                    return centerX + radius * Math.cos(angle);
                  }
                  return d.x;
                }).strength(d => selectedProfiles.includes(d.id) ? 0.05 : 0.01))
    
                .force('y', d3.forceY().y((d, i) => {
                  if (selectedProfiles.includes(d.id)) {
                // Calculate position for each expanded node around a circle
                    const index = selectedProfiles.indexOf(d.id);
                    const angle = index * angleStep;
                    return centerY + radius * Math.sin(angle);
                  }
                  return d.y;
                }).strength(d => selectedProfiles.includes(d.id) ? 0.05 : 0.01))
            
                // Apply radial force for non-selected nodes to push them away from the selected nodes
                .force('radial', d3.forceRadial((d) => {
                  return selectedProfiles.includes(d.id) ? 0 : Math.max(width, height) / 2;
                }, centerX, centerY).strength(0.05));
            }

  
                    svg.selectAll('*').remove();
  
                    const link = svg.selectAll('.link')
                      .data(links)
                      .enter().append('g')
                      .attr('class', 'link');
  
                    link.append('line')
                      .style('stroke', '#999')
                      .style('stroke-opacity', 0.6)
                      .style('stroke-width', 1.5);
  
                    // Append directional arrows using FontAwesome
                    link.append('text')
                      .attr('font-family', 'FontAwesome')
                      .attr('font-size', '16px')
                      .attr('text-anchor', 'middle')
                      .attr('dy', '.35em')
                      .text('\uf061') // FontAwesome icon for the directional arrow
                      .attr('fill', '#666');

                    link.append('text')
                      .attr('class', 'link-label')
                      .attr('dy', -5)
                      .attr('text-anchor', 'middle')
                      .style('font-size', '10px')
                      .text(d => d.relation);
  
                    const node = svg.selectAll('.node')
              .data(nodes)
              .enter().append('g')
              .attr('class', 'node')
              .call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended))
.on('click', (event, d) => {
  if (d.type === 'profile') {
    if (!selectedProfiles.includes(d.id)) {
      selectedProfiles.push(d.id);
    } else {
      selectedProfiles.splice(selectedProfiles.indexOf(d.id), 1);
    }
    updateGraph();
  }
});





  
                    node.append('circle')
                      .attr('r', d => d.type === 'profile' ? 25 : 20)
                      .attr('class', d => d.type === 'profile' && relatedProfiles.includes(d.id) ? 'profile-node related-glow' : d.type === 'profile' ? 'profile-node' : 'entity-node');
  
                    node.append('text')
                      .attr('font-family', 'Font Awesome 6 Free, FontAwesome, sans-serif')
                      .attr('font-weight', '900')
                      .attr('font-size', '16px')
                      .attr('text-anchor', 'middle')
                      .attr('dy', '.35em')
                      .text(d => d.type === 'profile' ? '\uf007' : (relationIcons[d.relation] || '\uf128'))
                      .attr('fill', '#fff');
  
                    node.append('text')
                      .attr('dy', 35)
                      .attr('text-anchor', 'middle')
                      .style('font-size', '10px')
                      .text(d => d.id)
                      .attr('fill', '#000');
  
                    simulation.nodes(nodes).on('tick', ticked);
                    simulation.force('link').links(links);
  
                    function ticked() {
                      link.select('line')
                        .attr('x1', d => d.source.x)
                        .attr('y1', d => d.source.y)
                        .attr('x2', d => d.target.x)
                        .attr('y2', d => d.target.y);
  
                      // Update positions of directional arrows
                      link.select('text')
                        .each(function (d) {
                          const arrow = d3.select(this);
                          const dx = d.target.x - d.source.x;
                          const dy = d.target.y - d.source.y;
                          const distance = Math.sqrt(dx * dx + dy * dy);

                          if (distance === 0) return;

                          const ux = dx / distance;
                          const uy = dy / distance;

                          const targetRadius = d.target.type === 'profile' ? 25 : 20;
                          const arrowOffset = 8;

                          const x_arrow = d.target.x - ux * (targetRadius + arrowOffset);
                          const y_arrow = d.target.y - uy * (targetRadius + arrowOffset);

                          arrow
                            .attr('x', x_arrow)
                            .attr('y', y_arrow)
                            .attr('transform', \`rotate(\${Math.atan2(dy, dx) * 180 / Math.PI}, \${x_arrow}, \${y_arrow})\`);
                        });
  
                      link.select('.link-label')
                        .attr('x', d => (d.source.x + d.target.x) / 2)
                        .attr('y', d => (d.source.y + d.target.y) / 2 + 15);
  
                      node.attr('transform', d => \`translate(\${d.x},\${d.y})\`);
                    }
  
                    function dragstarted(event, d) {
                      if (!event.active) simulation.alphaTarget(0.3).restart();
                      d.fx = d.x;
                      d.fy = d.y;
                    }
  
                    function dragged(event, d) {
                      d.fx = event.x;
                      d.fy = event.y;
                    }
  
                    function dragended(event, d) {
                      if (!event.active) simulation.alphaTarget(0);
                      d.fx = null;
                      d.fy = null;
                    }
                  };
  
                  updateGraph();
  
                  // Apply GSAP Animation to Highlight Profile Nodes
                  gsap.to(d3.selectAll('.related-glow').nodes(), {
                    duration: 0.5,
                    repeat: -1,
                    yoyo: true,
                    ease: "power1.inOut",
                    repeatDelay: 0.1,
                    attr: {
                      'stroke-width': 15
                    },
                    filter: "drop-shadow(0 0 20px #ff0000)"
                  });
                });
              });

              // Export as PNG
              window.exportAsImage = () => {
                const svgElement = document.querySelector('svg');
                saveSvgAsPng(svgElement, 'graph.png', { scale: 2, backgroundColor: '#ffffff' });
              };

              // Export as PDF
              window.exportAsPdf = () => {
                const svgElement = document.querySelector('svg');
                svgAsPngUri(svgElement, { scale: 2, backgroundColor: '#ffffff' }).then((uri) => {
                  const pdf = new jspdf.jsPDF({
                    orientation: 'landscape',
                    unit: 'pt',
                    format: [svgElement.clientWidth, svgElement.clientHeight],
                  });
                  const imgProps = pdf.getImageProperties(uri);
                  const pdfWidth = pdf.internal.pageSize.getWidth();
                  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                  pdf.addImage(uri, 'PNG', 0, 0, pdfWidth, pdfHeight);
                  pdf.save('graph.pdf');
                }).catch((error) => {
                  console.error('Error exporting as PDF:', error);
                });
              };
            </script>
          </body>
        </html>
      `);
      graphWindow.document.close();
      dispatch(clearApiResponse()); // Clear the API response after processing
    } else if (apiStatus === 'failed' && error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <button className='border border-black rounded-md h-9' onClick={handleGenerateGraph} disabled={apiStatus !== 'succeeded'}>
        Generate Graph
      </button>
    </>
  );
};

export default GenerateGraphButton;