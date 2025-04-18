$(document).ready(function() {
        
    function levenshtein(a, b) {
        const matrix = [];
        let i;
        for (i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        let j;
        for (j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }
        for (i = 1; i <= b.length; i++) {
            for (j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
                }
            }
        }
        return matrix[b.length][a.length];
    }

    function similarity(a, b) {
        let longer = a;
        let shorter = b;
        if (a.length < b.length) {
            longer = b;
            shorter = a;
        }
        const longerLength = longer.length;
        if (longerLength === 0) {
            return 1.0;
        }
        return (longerLength - levenshtein(longer, shorter)) / parseFloat(longerLength);
    }
    
    // bg_price = {
    //   's': 0,
    //   'c': 25
    // }

    var additional_price_percent = 50
    function getAdditionalCharString(){
      var additionals = parseInt($('.additional-option.active').text())
      if (additionals >= 1){
        return `${additionals+1} characters (${additionals*additional_price_percent}%)`
      }
      else{
        return `1 character (+0%)`
      }
    }
    function getBackgroundString(){
      if ($('input[name="bg"]:checked').val() == '0'){
        return 'Simple BG ($0)'
      }
      else{
        return 'Complex BG (+25%)'
      }
    }

    aliases = {
      'Headshot': 'hs',
      'Halfbody': 'hb',
      'Fullbody': 'fb',
      'Sketch': 'sk',
      'Light render': 'lr',
      'Full render': 'fr',
      '0': 'sbg',
      '25': 'cbg'
    }
    var label  = ''
    var header = ''
    function showExamples(){
      $('.example').removeClass('show')
      let classes = `.${aliases[header]}.${aliases[label]}.${aliases[$('input[name="bg"]:checked').val()]}`
      // console.log(classes)
      $(classes).addClass('show')

      if ($('.show').length > 0){
        $('.no-examples-h2::after').hide()
        $('.no-examples').hide()
      }
      else{
        $('.no-examples-h2').show()
        $('.no-examples').show()
      }
    }
    function reCalculate(){

      let $cell = $('.not-blurred .price.active');
      let txt = $cell.text();
      label = $cell.closest('tr').find('.label').text().trim();
      header = $cell.closest('table').find('th').eq($cell.index()).text().trim();
      
      if (header == 'Sketch'){
        $('.bg.not-blurred input:radio').filter('[value=0]').prop('checked', true);
        $('.bg.not-blurred input:radio').filter('[value=25]').prop('checked', false);
        $('.bg.not-blurred input:radio').filter('[value=25]').prop('disabled', true);
        $('.not-blurred .complex').css('opacity', '25%');
      }
      else{
        $('.bg.not-blurred  input:radio').filter('[value=25]').prop('disabled', false);
        $('.not-blurred .complex').css('opacity', '100%');
      }

      var price = parseInt($('.not-blurred .price.active').text())
      var bg_price = parseInt($('input[name="bg"]:checked').val())
      var additionals = parseInt($('.additional-option.active').text())
      
      $('.choosen-options').html(`${label} & ${header} ($${price}) +<br> (${getBackgroundString()} + ${getAdditionalCharString()}) =`)
      $('.estimated-price').text(`~ $${(price * (1 + bg_price/100) * (1 + (additionals*additional_price_percent)/100)).toFixed(2)}`)
    }
    function somethingChanged(){
      reCalculate()
      showExamples()
    }

    $(document).on('click', '.price', function() {
      $('.price').removeClass('active')
      $(this).addClass('active')

      somethingChanged()
    });
    $(document).on('click', '.additional-option', function() {
      $('.additional-option').removeClass('active')
      $(this).addClass('active')

      somethingChanged()
    });
    $(document).on('click', '.bg', function() {
      somethingChanged()
    });
    // $(document).on('click', '.bg', function() {
    //   somethingChanged()
    // });

    $('.bg.not-blurred input:radio').filter('[value=c]').prop('disabled', true);
    somethingChanged()

});
